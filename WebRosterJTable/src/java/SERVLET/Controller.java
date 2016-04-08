package SERVLET;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import DAO.CrudDao;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import MODEL.Student;

public class Controller extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private CrudDao dao;

    public Controller() {
        dao = new CrudDao();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        List<Student> studentList;//WTF = new ArrayList<>();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        response.setContentType("application/json");
        

        if (action != null) {
            if (action.equals("list")) {
                try {
                    int sindex = Integer.parseInt(request.getParameter("jtStartIndex"));
                    int size = Integer.parseInt(request.getParameter("jtPageSize"));
                    String orderby = request.getParameter("jtSorting");
                    System.out.println("$: "+sindex+" #: "+size+" O: "+orderby);
                    // Fetch Data from Student Table
                    //studentList = dao.getAllStudents();
                    studentList = dao.getStudents(sindex, size, orderby);
                    // Convert Java Object to Json
                    String jsonArray = gson.toJson(studentList);
                    int TotalRecordCount = dao.getTotalRecordCount();
                    // Return Json in the format required by jTable plugin
                    jsonArray = "{\"Result\":\"OK\",\"Records\":" + jsonArray + 
                            ",\"TotalRecordCount\":"+TotalRecordCount+"}";
                    //jsonArray = "{\"Result\":\"OK\",\"Records\":" + jsonArray + "}";
                    response.getWriter().print(jsonArray);
                } catch (Exception e) {
                    String error = "{\"Result\":\"ERROR\",\"Message\":" + e.getMessage() + "}";
                    response.getWriter().print(error);
                    System.err.println(e.getMessage());
                }
            } else if (action.equals("create") || action.equals("update")) {
                Student student = new Student();
                System.out.println("Made it to Create/Update");
                System.out.println("ID: " + request.getParameter("psuId"));
                System.out.println("FName: " + request.getParameter("firstName"));
                System.out.println("LName: " + request.getParameter("lastName"));
                System.out.println("Team: " + request.getParameter("team"));
                if (request.getParameter("psuId") != null) {
                    String studentId = request.getParameter("psuId");
                    student.setPsuId(studentId);
                }

                if (request.getParameter("firstName") != null) {
                    String name = request.getParameter("firstName");
                    student.setFirstName(name);
                }

                if (request.getParameter("lastName") != null) {
                    String department = request.getParameter("lastName");
                    student.setLastName(department);
                }

                if (request.getParameter("team") != null) {
                    String emailId = request.getParameter("team");
                    student.setTeam(emailId);
                }

                try {
                    if (action.equals("create")) {
                        // Create new record
                        dao.addStudent(student);
                        // Convert Java Object to Json
                        String json = gson.toJson(student);
                        // Return Json in the format required by jTable plugin
                        String jsonData = "{\"Result\":\"OK\",\"Record\":" + json + "}";
                        response.getWriter().print(jsonData);
                    } else if (action.equals("update")) {
                        System.out.println("GOT IT");
                        // Update existing record
                        dao.updateStudent(student);
                        // Convert Java Object to Json
                        String json = gson.toJson(student);
                        String jsonData = "{\"Result\":\"OK\",\"Record\":" + json + "}";
                        response.getWriter().print(jsonData);
                        System.out.println(json);
                        System.out.println();
                        System.out.println(jsonData);
                    }
                } catch (Exception e) {
                    String error = "{\"Result\":\"ERROR\",\"Message\":" + e.getMessage() + "}";
                    response.getWriter().print(error);
                }

            } else if (action.equals("delete")) {
                try {
                    System.out.println("Deleting");
                    // Delete record
                    if (request.getParameter("psuId") != null) {
                        String studentId = request.getParameter("psuId");
                        dao.deleteStudent(studentId);
                        String jsonData = "{\"Result\":\"OK\"}";
                        response.getWriter().print(jsonData);
                    }
                } catch (Exception e) {
                    String error = "{\"Result\":\"ERROR\",\"Message\":" + e.getMessage() + "}";
                    response.getWriter().print(error);
                    e.printStackTrace();
                    System.out.println("Failed");
                }
            }
        }
    }
}
