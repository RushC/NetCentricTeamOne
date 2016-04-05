package Model;

import java.beans.XMLEncoder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.util.ArrayList;
import java.util.Scanner;

import javax.servlet.ServletContext;

/**
 * A Roster contains a collection of Students.
 * 
 * @author Caleb Rush, Matt Downey, Nick Totolos.
 */
public class Roster implements java.io.Serializable {
    private Student[]       students;
    
    /**
     * Accessor method.
     */
    public String getStudents() { 
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            XMLEncoder encoder = new XMLEncoder(out);
            
            // Encode the students array into XML.
            encoder.writeObject(students);
            encoder.close();
            
            // Convert the byte array output into a string.
            return out.toString();
            
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }        
    }
    
    /**
     * Loads the student data from the specified file path which is loaded
     * using the specified servlet context.
     * 
     * @param context the servlet context (typically the application)
     * @param filePath the path to the resource file to read all the student
     *                 roster information from.
     */
    public void loadData(ServletContext context, String filePath) {
        // Attempt to load and read the given file.
        try (Scanner in = new Scanner(context.getResourceAsStream(filePath))) {
            // Start building a list of Students.
            ArrayList<Student> students = new ArrayList<>();
            
            // Continue reading through the resource until the end of the
            // file is encountered.
            while (in.hasNext()) {
                // Retrieve the last name.
                String lastName = in.next();
                
                // Ensure there is another word.
                if (!in.hasNext())
                    break;
                // Retrieve the first name.
                String firstName = in.next();
                
                // Retrieve the id.
                if (!in.hasNext())
                    break;
                String id = in.next();
                
                // Retrieve the team number.
                if (!in.hasNext())
                    break;
                String teamNumber = in.next();
                
                // Create the student from the retrieved information.
                Student student = new Student();
                student.setFirstName(firstName);
                student.setLastName(lastName);
                student.setID(id);
                student.setTeamNumber(teamNumber);
                
                // Add the student to the list.
                students.add(student);
            }
            
            // Set the students array.
            this.students = students.toArray(new Student[0]);
        }
    }
}
