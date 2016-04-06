package Model;

/**
 * A Student contains a name, ID, and associated team number.
 * 
 * @author Caleb Rush, Matt Downey, Nick Totolos
 */
public class Student implements java.io.Serializable {
    private String          firstName;
    private String          lastName;
    private String          id;
    private String          teamNumber;
    
    /**
     * Accessor methods.
     */
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getID() { return id; }
    public String getTeamNumber() { return teamNumber; }
    
    /**
     * Mutator methods.
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setID(String id) { this.id = id; }
    public void setTeamNumber(String teamNumber) { this.teamNumber = teamNumber; }
}
