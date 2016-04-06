package Controller;

import Model.Roster;
import Model.Student;
import Model.Team;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author mwd5503
 */
    //@WebServlet(urlPatterns = {"/Controller"})
public class RosterCRUDController extends HttpServlet {
    public static final String LNAME_HEADER = "LAST_NAME"   ; // header value for the last name of a student
    public static final String FNAME_HEADER = "FIRST_NAME"  ; // header value for the first name of a student
    public static final String ID_HEADER    = "PSU_ID"      ; // header value for the id of a student
    public static final String TEAM_HEADER  = "Team"        ; // header value for the team number of a student
    
    private static final ArrayList<Student>     students    = new ArrayList<>();    // Current State of the roster
    private static final HashMap<Integer, Team> teams       = new HashMap<>();      // All of the teams in the roster.
    
    private void loadStudents(ServletContext context, String filePath) throws IOException {
        RosterCRUDController.students.clear();
        try (Scanner in = new Scanner(context.getResourceAsStream(filePath))) {
            
            // Continue reading through the resource until the end of the
            // file is encountered.
            while (in.hasNext()) {
                // Retrieve the last name.
                String lastName = in.next();
                
                // Ensure there is another word.
                if (!in.hasNext())
                    break;
                // Retrieve the first name.
                String firstName = in.next();
                
                // Retrieve the id.
                if (!in.hasNext())
                    break;
                String id = in.next();
                
                // Retrieve the team number.
                if (!in.hasNext())
                    break;
                String teamNumber = in.next();
                
                // Create the student from the retrieved information.
                Student student = new Student();
                student.setFirstName(firstName);
                student.setLastName(lastName);
                student.setID(id);
                student.setTeamNumber(teamNumber);
                
                // Add the student to the list.
                students.add(student);
                
                // Add the student to their team.
                addStudentToTeam(student);
            }
        }
    }
    
    /**
     * Adds the specified Student into their respective team.
     * 
     * @param s the student to sort into their team.
     */
    private void addStudentToTeam(Student s) {
        // Check if the team map currently has the student's team.
        int teamNumber = Integer.parseInt(s.getTeamNumber());
        if (!teams.containsKey(teamNumber)) {
            Team team = new Team();
            team.setTeamID(teamNumber);
            
            // If not, add the team.
            teams.put(teamNumber, team);
        }
        
        // Add the student to their respective team.
        teams.get(teamNumber).addStudent(s);
    }
    
    /**
     * Creates a sorted array of teams from the team map.
     * 
     * @return the sorted team array.
     */
    private Team[] generateTeamArray() {
        return teams.values().stream()
                .sorted((a, b) -> a.getTeamID() - b.getTeamID())
                .toArray(Team[]::new);
    }
    
    private void writeStudents(File f) {
        //TODO
    }
    
    
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Load the students if the student array list is empty:
        if (RosterCRUDController.students.isEmpty())
            loadStudents(this.getServletContext(), "/WEB-INF/data/Roster.txt");
        
        System.out.println("GET " + request.getRequestURL() + " QUERY STRING: " + request.getQueryString());
        String dest = request.getParameter("dest");
        if (dest == null )
            dest = "browse";
        
        String url = "/views/browse.jsp";
        String r = request.getRequestURL().toString();
        switch(dest) {
            case "browse" :
                break;
            case "update" :
                url = "/views/update.jsp";
                break;
            case "addStudent" :
                url = "/views/addStudent.jsp";
                break;
            case "deleteStudent" :
                url = "/views/deleteStudent.jsp";
                break;
            case "deleteTeam" :
                url = "/views/deleteTeam.jsp";
                break;
        }
        
        //display the last student in the arraylist to demonstrate doPOST:
        System.out.println(students.get(students.size() - 1).getFirstName());
        // Send a roster bean containg the student roster:
        Roster roster = new Roster();
        roster.putStudents(students.toArray(new Student[0]));
        roster.putTeams(generateTeamArray());
        request.setAttribute("roster", roster);
        
        // Forward the response:
        System.out.println("SENT: " + url);
        System.out.flush();
        RequestDispatcher dispatcher = request.getRequestDispatcher(url);
        dispatcher.forward(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.printf("%s\t%s\t%s\n",
                request.getParameter("type"),
                request.getParameter("action"),
                request.getParameter("id"));
        String action = request.getParameter("action");
        // Check if something is being deleted.
        if (action != null && "delete".equalsIgnoreCase(action.trim())) {
            System.out.println("Deleting...");
            String type = request.getParameter("type"); // part of query string, either "team" or "student"
            String what = request.getParameter("id").trim(); // part of query string, either a student id or team number
            // Determine deletion type:
            if ("team".equalsIgnoreCase(type.trim())) { // Delete all students on a team
                // Remove all students in the student list with the given team number.
                boolean deleted = students.removeIf((Student s) -> {
                    return s.getTeamNumber().equalsIgnoreCase(what);
                        });
                teams.remove(Integer.parseInt(what));
            } 
            else if ("student".equalsIgnoreCase(type.trim())) {
                // Remove the student with the given ID.
                boolean deleted = students.removeIf((Student s) -> {
                    System.out.println("Deleting.....");
                    return s.getID().equalsIgnoreCase(what);
                        });
            }
            else { // Otherwise respond with status 400 (bad request)
                response.setStatus(400);            
            }
        }
        
        else {
            // Create a new student object and add it to the student list:
            Student student = new Student();

            // Set the values for the student based on the form data
            student.setLastName(request.getParameter("lastName").trim()); // value from an input element with name="lastName"
            student.setFirstName(request.getParameter("firstName").trim()); // value from an input element with name="firstName"
            student.setID(request.getParameter("id").trim()); // value from an input elementwith name="id"
            student.setTeamNumber(request.getParameter("team").trim()); // value from an input element with name="team"

            // Make sure the ID is unique:
            boolean unique = false;
            if (!student.getID().isEmpty()) {
                unique = true;
                for (Student s : students) {
                    if (s.getID().equals(student.getID())) {
                        unique = false;

                        // Update the student instead.
                        s.setFirstName(student.getFirstName());
                        s.setLastName(student.getLastName());
                        s.setTeamNumber(student.getTeamNumber());
                    }
                }
            }

            // If unique, add the student to the list.
            if (unique) {
                students.add(student);
            }
        }
        response.sendRedirect("index.jsp");
    }
    
    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String type = request.getParameter("type"); // part of query string, either "team" or "student"
        String what = request.getParameter("id"); // part of query string, either a student id or team number
        // Determine deletion type:
        if (type == "team") { // Delete all students on a team
            // Remove all students in the student list with the given team number.
            boolean deleted = students.removeIf((Student s) -> {
                return s.getTeamNumber() == what;
                    });
            // Indicate whether or not any students were removed.
            request.setAttribute("deleteSuccess", deleted);
        } 
        else if (type == "student") {
            // Remove the student with the given ID.
            boolean deleted = students.removeIf((Student s) -> {
                return s.getID() == what;
                    });
            // Indicate whether or not any students were removed.
            request.setAttribute("deleteSuccess", deleted);
        }
        else { // Otherwise respond with status 400 (bad request)
            response.setStatus(400);            
        }
        
       RequestDispatcher dispatcher = request.getRequestDispatcher("/WebRosterMVC/Controller");
        dispatcher.forward(request, response);
    }
    
    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {        
        
        // Get the values to update:
        //implementation note: define these key/value pairs in query string or form data
        String id = request.getParameter("id"); // ID of student to update
        String firstName = request.getParameter("firstName"); // new first name of student or empty string if unchanged
        String lastName = request.getParameter("lastName"); // new last name of student or empty string if unchanged
        String team = request.getParameter("team"); // new team number of student or empty string if unchanged
        System.out.printf("%s\t%s\t%s\t%s\n", id, firstName, lastName, request.getQueryString());
        
        // Make sure everything was specified.
        if (id == null || firstName == null || lastName == null || team == null) {
            // Respond with status of 400 (bad request)
            response.setStatus(400);
        }
        else { // request is valid
            
            // set the values to the headers if the id is the header id:
            if (id.trim() == ID_HEADER) {
                firstName = FNAME_HEADER;
                lastName = LNAME_HEADER;
                team = TEAM_HEADER;
            }
            
            // Find and modify the student bean with the given id.
            boolean updated = false;
            id = id.trim(); //make sure there are no extra whitespace leading/trailing the id
            for (Student student : students) {
                if (student.getID() == id) {
                    updated = true;
                    student.setFirstName(firstName.isEmpty() ? student.getFirstName() : firstName);
                    student.setLastName(lastName.isEmpty() ? student.getLastName() : lastName);
                    student.setTeamNumber(team.isEmpty() ? student.getTeamNumber() : team);
                    // Set the student bean to the newly updated student:
                    request.setAttribute("studentBean", student);
                }
            }
            
            System.out.println(updated);
            
            // Indicate whether or not a student was updated to the new values:
            request.setAttribute("updateSuccess", updated);
        }
        
        // Forward the response.
        RequestDispatcher dispatcher
                = request.getRequestDispatcher("/views/update.jsp");
        dispatcher.forward(request, response);
    }


}
