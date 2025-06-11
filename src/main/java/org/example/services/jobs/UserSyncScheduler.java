package org.example.services.jobs;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.example.services.UserApiservice;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Date;

@ApplicationScoped
public class UserSyncScheduler {

    private static final Logger LOG = LoggerFactory.getLogger(UserSyncScheduler.class);

    @Inject
    Scheduler scheduler;

    @Inject
    UserApiservice userApiService;

    public void onStart(@Observes StartupEvent event) {
        LOG.info("Initializing user synchronization scheduler...");
        scheduleJobs();
    }

    private void scheduleJobs() {
        try {
            JobDetail jobDetail = buildJobDetail();

            Date startAt = Date.from(Instant.now().plusSeconds(60));
            Trigger initialTrigger = TriggerBuilder.newTrigger()
                    .withIdentity("initialUserSyncTrigger", "sync")
                    .startAt(startAt)
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule().withRepeatCount(0))
                    .forJob(jobDetail)
                    .build();

            Trigger hourlyTrigger = TriggerBuilder.newTrigger()
                    .withIdentity("hourlyUserSyncTrigger", "sync")
                    .withSchedule(CronScheduleBuilder.cronSchedule("0 0 * * * ?"))
                    .forJob(jobDetail)
                    .build();

            if (!scheduler.checkExists(jobDetail.getKey())) {
                scheduler.scheduleJob(jobDetail, initialTrigger);
                scheduler.scheduleJob(hourlyTrigger);
                LOG.info("User sync job scheduled: initial sync in 1 minute, then hourly");
            } else {
                LOG.info("User sync job already exists");
            }
        } catch (Exception e) {
            LOG.error("Failed to schedule user sync job", e);
        }
    }

    private JobDetail buildJobDetail() {
        JobDataMap jobDataMap = new JobDataMap();

        return JobBuilder.newJob(UserSyncJob.class)
                .withIdentity("userSyncJob", "sync")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }
}
