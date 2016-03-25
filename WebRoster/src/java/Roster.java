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
    public Student[] getStudents() { return students; }
    
    /**
     * Mutator method.
     */
    public void setStudents(Student[] students) { this.students = students; }
}
