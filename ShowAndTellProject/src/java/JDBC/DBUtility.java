package JDBC;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBUtility is a simple JDBC (Java Database Connectivity) tool that creates a
 * connection with the LectureDB database. Whenever the CrudDao needs to
 * retrieve a connection to the database, it should use this class.
 * 
 * This class implements the Singleton pattern to assure that only one connection
 * to the database is ever made.
 * 
 * @author Caleb Rush
 */
public class DBUtility {
    // The URL for the database host.
    private static final String HOST = "jdbc:derby://localhost:1527/LectureDB";
    private static final String USERNAME = "app";
    private static final String PASSWORD = "app";

    // The connection to the database.
    private static Connection connection = null;

    /**
     * Returns the connection to the LectureDB database.
     * 
     * If the connection is already established, the already established
     * connection will be returned instead of making a new one.
     * 
     * If the connection was not already established, a connection will be
     * attempted and returned.
     * 
     * @return the connection to the database or null if a connection could not
     *         be established.
     */
    public static Connection getConnection() {
        // If the connection was already established, return it.
        if (connection != null) {
            return connection;
            
        // Otherwise, establish the connection.
        } else {
            // Attempt to connect to the database with the constant credentials.
            try {
                connection = DriverManager.getConnection(HOST, USERNAME, PASSWORD);
            } catch (SQLException err) {
                System.out.println(err.getMessage());
            }
            
            // Return the created connection or null if the connection failed.
            return connection;
        }
    }
}
