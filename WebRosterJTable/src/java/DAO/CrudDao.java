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
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            System.out.println("Exception");
            
            // Attempt to initialize the Student table.
            initStudentTable();
            return getAllStudents();
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
            System.out.println("Table not initialized. Initializing...");
            initStudentTable();
            return getStudents(sindex, size, sorting);
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
    
    /**
     * Attempts to run the queries in students.sql.
     */
    private void initStudentTable() {
        try {
            System.out.println("MADE IT!");
            Statement statement = dbConnection.createStatement();
            try (Scanner in = new Scanner(getClass().getClassLoader().getResourceAsStream("/DAO/students.sql"))) {
                while (in.hasNextLine()) {
                    // Read a query from each line.
                    String query = in.nextLine().trim();
                    // Remove the semicolon from the query.
                    query = query.substring(0, query.lastIndexOf(';'));
                    statement.execute(query);
                }
            }
        } catch (SQLException ex) {
            // At this point, I don't know wtf happened.
            ex.printStackTrace();
        }
    }
}
