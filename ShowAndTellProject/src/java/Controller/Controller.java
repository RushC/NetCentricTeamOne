/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import Model.Entity;
import Model.Lecture;
import Model.Page;
import java.io.IOException;
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
        response.getWriter().print("Testing");
        if(action != null){
            /*
                actions:
                newLecture
                newPage
                newEntity
                deleteEntity
                deletePage
                deleteLecture
                changeEntity
                changePage
                changeLecture
                getLecture
                getLectureList
             */
            response.getWriter().print("Testing");
            switch (action) {
                case "newLecture":
                    break;
                case "newPage":
                    break;
                case "newEntity":
                    break;
                case "deleteEntity":
                    break;
                case "deletePage":
                    break;
                case "deleteLecture":
                    break;
                case "changeEntity":
                    break;
                case "changePage":
                    break;
                case "changeLecture":
                    break;
                case "getLecture":
                    break;
                case "getLectureList":
                    break;
                default:
                    break;
            }
        }
    }
}
