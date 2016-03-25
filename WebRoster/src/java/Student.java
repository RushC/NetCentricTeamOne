/**
 * A Student contains a name, ID, and associated team number.
 * 
 * @author Caleb Rush, Matt Downey, Nick Totolos
 */
public class Student implements java.io.Serializable {
    private String      firstName;
    private String      lastName;
    private int         id;
    private int         teamNumber;
    
    /**
     * Accessor methods.
     */
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public int getID() { return id; }
    public int getTeamNumber() { return teamNumber; }
    
    /**
     * Mutator methods.
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setID(int id) { this.id = id; }
    public void setTeamNumber(int teamNumber) { this.teamNumber = teamNumber; }
}
