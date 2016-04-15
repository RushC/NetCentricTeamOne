/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import java.io.IOException;
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
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
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
            if(action.equals("newLecture")){
                
            }else if(action.equals("newPage")){
                
            }else if(action.equals("newEntity")){
                
            }else if(action.equals("deleteEntity")){
                
            }else if(action.equals("deletePage")){
                
            }else if(action.equals("deleteLecture")){
                
            }else if(action.equals("changeEntity")){
                
            }else if(action.equals("changePage")){
                
            }else if(action.equals("changeLecture")){
                
            }else if(action.equals("getLecture")){
                
            }else if(action.equals("getLectureList")){
                
            }
        }
    }
}
