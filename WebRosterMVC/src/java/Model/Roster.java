package Model;

import java.util.HashMap;

/**
 * A Roster contains a collection of Students.
 * 
 * @author Caleb Rush, Matt Downey, Nick Totolos.
 */
public class Roster implements java.io.Serializable {
    private Student[]       students;
    private Team[]          teams;
    
    public void putStudents(Student[] students) {
        this.students = students;
    }
    
    public void putTeams(Team[] teams) {
        this.teams = teams;
    }
    
    /**
     * Accessor method.
     */
    public Student[] getStudents() { 
        return students;      
    }
    
    public Team[] getTeams() {
        return teams;
    }
}
