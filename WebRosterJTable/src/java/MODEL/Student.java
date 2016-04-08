package MODEL;

/**
 * A Student contains a name, ID, and associated team number.
 * 
 * @author Caleb Rush, Matt Downey, Nick Totolos
 */
public class Student implements java.io.Serializable {
    private String      firstName;
    private String      lastName;
    private String         psuId;
    private String         team;
    
    /**
     * Accessor methods.
     */
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPsuId() { return psuId; }
    public String getTeam() { return team; }
    
    /**
     * Mutator methods.
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setPsuId(String id) { this.psuId = id; }
    public void setTeam(String teamNumber) { this.team = teamNumber; }
}
