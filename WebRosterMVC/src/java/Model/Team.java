package Model;

import java.util.ArrayList;

/**
 * A Team consists of multiple Students.
 * 
 * @author Caleb Rush
 */
public class Team {
    // The list of students in the team.
    private final ArrayList<Student>    students;
    // The ID of the team.
    private int                         teamID;
    
    /**
     * Constructs a new Team instance with no students by default.
     */
    public Team() {
        students = new ArrayList<>();
    }
    
    /**
     * Accessor methods.
     */
    public Student[] getStudents() { return students.toArray(new Student[0]); }
    public int getTeamID() { return teamID; }
    
    /**
     * Mutator methods.
     */
    public void addStudent(Student student) { students.add(student); }
    public void setTeamID(int teamID) { this.teamID = teamID; }
}
