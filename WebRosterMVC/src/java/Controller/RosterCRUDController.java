
package Controller;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author mwd5503
 */
    @WebServlet(urlPatterns = {"/"})
public class RosterCRUDController extends HttpServlet {
    
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
        String dest = request.getRequestURI();
        switch(dest) {
            case "/WebRosterMVC/browse" :
            case "/WebRosterMVC/" :
                dest = "/WEB-INF/views/browse.jsp";
                break;
            case "/WebRosterMVC/update" :
                dest = "/WEB-INF/views/update.jsp";
                break;
            case "/WebRosterMVC/addTeam" :
                dest = "/WEB-INF/views/addTeam.jsp";
                break;
            case "/WebRosterMVC/addStudent" :
                dest = "/WEB-INF/views/addStudent.jsp";
                break;
            case "/WebRosterMVC/deleteStudent" :
                dest = "/WEB-INF/views/deleteStudent.jsp";
                break;
            case "/WebRosterMVC/deleteTeam" :
                dest = "/WEB-INF/views/deleteTeam.jsp";
                break;
        }
//        if (request.getParameter("dest") == null) {
//            dest += "browse.jsp";
//        }
//        else {
//            dest += request.getParameter("dest") + ".jsp";
//        }
        RequestDispatcher dispatcher = request.getRequestDispatcher(dest);
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
        RequestDispatcher dispatcher
                = request.getRequestDispatcher(request.getRequestURI());
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
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
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
        
    }


}
