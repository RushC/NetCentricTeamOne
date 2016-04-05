package Controller;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import java.io.File;
import java.util.ArrayList;

/**
 * 
 * @author mwd5503
 */
public class RosterDataService {
    private final ArrayList<Student>    students;
    
    public RosterDataService() {
        students = new ArrayList<>();
    }
    
    public Model.Roster loadStudents(File f) throws java.io.IOException {
        students.clear();
        java.io.BufferedReader in = new java.io.BufferedReader(new java.io.FileReader(f));
        String line = in.readLine();
        return null;
    }
}
