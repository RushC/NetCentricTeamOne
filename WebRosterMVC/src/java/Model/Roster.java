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
    
    
    public void putStudents(Student[] students) {
        this.students = students;
    }
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
}
