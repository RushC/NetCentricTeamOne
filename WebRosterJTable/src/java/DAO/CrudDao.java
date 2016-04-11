package DAO;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import JDBC.DBUtility;
import MODEL.Student;

public class CrudDao {

    private final Connection dbConnection;
    private PreparedStatement pStmt;

    public CrudDao() {
        dbConnection = DBUtility.getConnection();
    }

    public void addStudent(Student student) {
        String insertQuery = "INSERT INTO STUDENT(PSUID, FIRSTNAME, "
                + "LASTNAME, TEAM) VALUES (?,?,?,?)";
        try {
            pStmt = dbConnection.prepareStatement(insertQuery);
            pStmt.setString(1, student.getPsuId());
            pStmt.setString(2, student.getFirstName());
            pStmt.setString(3, student.getLastName());
            pStmt.setString(4, student.getTeam());
            pStmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
    }

    public void deleteStudent(String userId) {
        String deleteQuery = "DELETE FROM STUDENT WHERE PSUID = ?";
        try {
            pStmt = dbConnection.prepareStatement(deleteQuery);
            pStmt.setString(1, userId);
            pStmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
    }

    public void updateStudent(Student student) {
        String updateQuery = "UPDATE STUDENT SET FIRSTNAME = ?, "
                + "LASTNAME = ?, TEAM = ? WHERE PSUID = ?";
        try {
            pStmt = dbConnection.prepareStatement(updateQuery);
            pStmt.setString(4, student.getPsuId());
            pStmt.setString(1, student.getFirstName());
            pStmt.setString(2, student.getLastName());
            pStmt.setString(3, student.getTeam());
            pStmt.executeUpdate();

        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
    }

    public List<Student> getAllStudents() {
        List<Student> students = new ArrayList<>();

        String query = "SELECT * FROM STUDENT ORDER BY PSUID";
        try {
            Statement stmt = dbConnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                Student student = new Student();

                student.setPsuId(rs.getString("PSUID"));
                student.setFirstName(rs.getString("FIRSTNAME"));
                student.setLastName(rs.getString("LASTNAME"));
                student.setTeam(rs.getString("TEAM"));
                students.add(student);
            }
            
            // Check if no students were found.
            if (students.isEmpty()) {
                Statement statement = dbConnection.createStatement();
                try (Scanner in = new Scanner(ClassLoader.getSystemClassLoader().getResourceAsStream("/DAO/students.sql"))) {
                    while (in.hasNextLine())
                        // Read a query from each line.
                        statement.execute(in.nextLine());
                }
                // Try loading the students again.
                return getAllStudents();
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            
            // If there was an exception, the Student table likely wasn't created
            // yet. Load the SQL file and run all of its queries.
            try {
                Statement statement = dbConnection.createStatement();
                try (Scanner in = new Scanner(ClassLoader.getSystemClassLoader().getResourceAsStream("/DAO/students.sql"))) {
                    while (in.hasNextLine()) {
                        // Read a query from each line.
                        statement.execute(in.nextLine());
                        System.out.println("SUP BITCH!");
                    }
                }
                // Try loading the students again.
                return getAllStudents();
            } catch (SQLException ex) {
                // At this point, I don't know wtf happened.
                e.printStackTrace();
            }
        }
        
        return students;
    }
    
    public List<Student> getStudents(int sindex, int size, String sorting) {
        List<Student> students = new ArrayList<>();
        if (sorting==null) sorting = "PSUID ASC";
        //String query = "SELECT * FROM STUDENT ORDER BY "+ sorting;
        String query = "SELECT * FROM (" + 
            "SELECT ROW_NUMBER() OVER() AS rownum, STUDENT.* " + 
            "FROM STUDENT ORDER BY " + sorting +
            ") AS tmp " + 
            "WHERE rownum >" + sindex + " AND rownum <= " + (sindex + size); 
            //System.out.println(query);
        try {
            Statement stmt = dbConnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                Student student = new Student();

                student.setPsuId(rs.getString("PSUID"));
                student.setFirstName(rs.getString("FIRSTNAME"));
                student.setLastName(rs.getString("LASTNAME"));
                student.setTeam(rs.getString("TEAM"));
                students.add(student);
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return students;
    }    
    public int getTotalRecordCount() {
        int rowCount=0;
        // get the number of rows from the result set
        String query = "SELECT COUNT(*) FROM STUDENT";
        try {
            Statement stmt = dbConnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            rs.next();
            rowCount = rs.getInt(1);
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return rowCount;
    }    
}
