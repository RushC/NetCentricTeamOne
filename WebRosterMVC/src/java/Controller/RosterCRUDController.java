
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
    //@WebServlet(urlPatterns = {"/Controller"})
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
        System.out.println("GET " + request.getRequestURL() + " QUERY STRING: " + request.getQueryString());
        String dest = request.getParameter("dest");
        if (dest == null && request.getRequestURL().toString().endsWith("/Controller"))
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
            case "addTeam" :
                url = "/views/addTeam.jsp";
                break;
            case "removeStudent" :
                url = "/views/removeStudent.jsp";
                break;
            case "removeTeam" :
                url = "/views/removeTeam.jsp";
                break;
        }
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
