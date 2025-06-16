package org.example;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.example.repository.UserApiRepository;
import org.example.services.UserApiService;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class TestCronJob {

    @Inject
    UserApiService userApiservice;

    @Inject
    UserApiRepository userApiRepository;

    @Test
    public void testManualSync() {
            given()
                    .when()
                    .get("/users/")
                    .then()
                    .statusCode(200)
                    .body("size()", is(0));

            userApiservice.syncUsers();

            given()
                    .when()
                    .get("/users")
                    .then()
                    .statusCode(200)
                    .body("size()", is(10));
    }
}
