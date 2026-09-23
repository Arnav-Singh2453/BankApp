package org.arnav.bankapp.utils;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {
    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    private static final String URL = getEnv("DB_URL");
    private static final String USER = getEnv("DB_USER");
    private static final String PASS = getEnv("DB_PASSWORD");

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL Driver not found", e);
        }
    }

    private static String getEnv(String key) {
        String value = dotenv.get(key);
        if (value == null || value.trim().isEmpty()) {
            value = System.getenv(key);
        }
        return value;
    }

    public static Connection getConnection() throws SQLException {
        if (URL == null || USER == null || PASS == null) {
            throw new SQLException("Database configuration is missing. Set DB_URL, DB_USER, and DB_PASSWORD.");
        }
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
