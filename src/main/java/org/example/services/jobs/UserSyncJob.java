package org.example.services.jobs;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.example.services.UserApiService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class UserSyncJob implements Job {

    private static final Logger LOG = LoggerFactory.getLogger(UserSyncJob.class);

    @Inject
    UserApiService userApiService;

    @Override
    @Transactional
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            LOG.info("Running user synchronization job");
            userApiService.syncUsers();
            LOG.info("User synchronization completed successfully");
        } catch (Exception e) {
            LOG.error("Error during user synchronization", e);
            throw new JobExecutionException("Failed to sync users", e, false);
        }
    }
}
