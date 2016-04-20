/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import DAO.CrudDao;
import Model.Entity;
import Model.Lecture;
import Model.Page;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author njt5112
 */
public class Controller extends HttpServlet {
    //public static final String NAME_HEADER = "LECTURE_NAME"   ; // header value for the name of a lecture
    //public static final String ID_HEADER   = "LECTURE_ID"      ; // header value for the id of a lecture
    CrudDao lectureDB = new CrudDao();
    
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        if (request.getRequestURI().endsWith("side.jsp")) {
            RequestDispatcher dispatcher = request.getRequestDispatcher("/views/side.jsp");
        dispatcher.forward(request, response);
        }
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        response.setContentType("application/json");
        if(action != null){
            System.out.println("ID: " + request.getParameter("id") + "\t\tAction: " +
                    request.getParameter("action"));
            switch (action) {
                case "newLecture": //
                    Lecture lecture = getLecture(request);
                    lectureDB.addLecture(lecture);
                    //response.sendRedirect("views/createLecture.jsp");
                    break;
                case "newPage": //
                    Page page = getPage(request);
                    lectureDB.addPage(page);
                    break;
                case "deletePage": //
                    page = getPage(request);
                    lectureDB.deletePage(page.getLectureID(), page.getPageID());
                    break;
                case "deleteLecture": //
                    lecture = getLecture(request);
                    lectureDB.deleteLecture(lecture.getLectureID());
                    break;
                case "updatePage": //
                    page = getPage(request);
                    lectureDB.updatePage(page);
                    break;
                case "updateLecture": //
                    lecture = getLecture(request);
                    lectureDB.updateLecture(lecture);
                    break;
                default:
                    break;
            }
        }
    }
    
    private Lecture getLecture(HttpServletRequest request){
        return null;
    }
    
    private Page getPage(HttpServletRequest request) {
        return null;
    }
    
    private Entity[] getAddedEntities(HttpServletRequest request) {
        return null;
    }
    
    private Entity[] getDeletedEntities(HttpServletRequest request) {
        return null;
    }
    
    private Entity[] getUpdatedEntities(HttpServletRequest request) {
        return null;
    }
}
