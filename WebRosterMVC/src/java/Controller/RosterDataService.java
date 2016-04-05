package Controller;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import Model.Roster;
import Model.Student;
import java.io.File;
import java.util.ArrayList;

/**
 * 
 * @author mwd5503
 */
public class RosterDataService {
    
    public Roster loadRoster(File f) throws java.io.IOException {
        
        java.io.BufferedReader in = new java.io.BufferedReader(new java.io.FileReader(f));
        String line = in.readLine();
        ArrayList<Student> students = new ArrayList<>();
        while (line != null) {
            // Create a new student bean:
            Student studentBean = new Student();

                // Set the last name.
                studentBean.setLastName(line.trim());
                
                // Get the first name.
                line = in.readLine();
                line = line == null ? "" : line;
                
                // Set the first name.
                studentBean.setFirstName(line.trim());
                
                // Get the ID.
                line = in.readLine();
                line = line == null ? "" : line;
                
                // Set the ID:
                studentBean.setID(line.trim());
                
                // Get the Team number.
                line = in.readLine();
                line = line == null ? "" : line;
                
                // Set the team number.
                studentBean.setTeamNumber(line.trim());
                
                // Add the student to the array list.
                students.add(studentBean);
            }
        
            // Set up a roster bean with the students array.
            Roster rosterBean = new Roster();
            rosterBean.putStudents(students.toArray(new Student[0]));
            
            // Close the input stream.
            in.close();
            
            // Return the roster bean.
            return rosterBean;
    }
}
