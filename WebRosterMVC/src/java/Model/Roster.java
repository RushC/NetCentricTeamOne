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
    public Student[] getStudents() { 
        return students;      
    }
}
