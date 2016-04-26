/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import com.google.gson.Gson;
import DAO.CrudDao;
import Model.Entity;
import Model.Lecture;
import Model.Page;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import javax.imageio.ImageIO;
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
    private CrudDao lectureDB = new CrudDao();
    // The path for the images folder where all of the images are stored.
    private String imagePath;
    
    public Controller() {
        
    }
    
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
        imagePath = getServletContext().getRealPath("/") + "images/";
        
        // Retrieve the action of the request.
        String action = request.getParameter("action");
        
        // Specify that the response will be a JSON object.
        response.setContentType("application/json");
        
        // Ensure there was an action.
        if(action != null){
            System.out.println("ID: " + request.getParameter("id") + "\t\tAction: " +
                    request.getParameter("action"));
            
            // Determine what action was specified.
            switch (action) {
                
                // Retrieve the pages for the requested lecture.
                case "getPages":
                    getPages(request, response);
                    break;
                    
                case "getEntities":
                    getEntities(request, response);
                    break;
                    
                // Create a new lecture and add it to the database.
                case "newLecture": 
                    addLecture(request);
                    break;
                    
                // Delete an existing lecture from the database.
                case "deleteLecture": 
                    deleteLecture(request);
                    break;
                                        
                // Update an exisiting lecture in the database.
                case "updateLecture":
                    updateLecture(request, response);
                    break;
                    
                // Any other action is a bad request.
                default:
                    response.sendError(400);
                    return;
            }
            
            // Tell the client that the action was completed successfully.
            response.setStatus(200);
        }
    }
    
    /**
     * Adds a lecture based on the parameters found in the specified request.
     * 
     * @param request the request object containing the parameters.
     */
    private void addLecture(HttpServletRequest request) {
        // Retrieve the parameters from the request.
        Lecture lectures = getParameter(request, "lecture", Lecture.class);
        
        // Insert the lecture into the database.
        lectureDB.addLecture(lectures);
    }
    
    /**
     * Deletes the lecture based on the parameters found in the specified
     * request.
     * 
     * @param request the request object containing the parameters.
     */
    private void deleteLecture(HttpServletRequest request) {
        // Retrieve the parameter from the request.
        Lecture lecture = getParameter(request, "lecture", Lecture.class);
        
        // Delete the lecture from the database.
        lectureDB.deleteLecture(lecture.getLectureID());
    }
    
    /**
     * Retrieves the Entities requested by the client and sends the back in the
     * response body.
     * 
     * @param request the HTTP request from the client to the server.
     * @param response the HTTP response from the server to the client. 
     */
    private void getEntities(HttpServletRequest request,
            HttpServletResponse response) {
        // Retrieve the page object from the request.
        Page page = getParameter(request, "page", Page.class);
        
        // Retrieve all of the entities on the page.
        Entity[] entities = lectureDB.getEntities(page.getPageID(), page.getLectureID());
        
        // Convert the entites to a JSON string.
        String entitiesJSON = new Gson().toJson(entities);
        entitiesJSON = "{ \"entities\": " + entitiesJSON + "}";
        
        // Write the JSON string to the response.
        try {
            response.getWriter().write(entitiesJSON);
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }
    
    /**
     * Retrieves the pages requested by the client and sends them back in the
     * response body.
     * 
     * @param request the HTTP request from the client to the server.
     * @param response the HTTP response from the server to the client.
     */
    private void getPages(HttpServletRequest request,
            HttpServletResponse response) {
        // Retrieve the lecture object from the request.
        Lecture lecture = getParameter(request, "lecture", Lecture.class);
        
        // Retrieve all of the pages in the lecture.
        Page[] pages = lectureDB.getPages(lecture.getLectureID());
        
        // Convert the pages to a JSON string.
        String pagesJSON = new Gson().toJson(pages);
        pagesJSON = "{ \"pages\": " + pagesJSON + "}";
        
        // Set the JSON string as the response body.
        try {
            response.getWriter().write(pagesJSON);
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }
    
    /**
     * Updates the lectures based on the parameters found in the specified
     * request and sends a response.
     * 
     * @param request the request object containing the parameters.
     * @param response the response object to send the response through.
     */
    private void updateLecture(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve all of the parameters from the request.
        Entity[] deletedEntities = getParameter(request, "deletedEntities", Entity[].class);
        Entity[] newEntities = getParameter(request, "newEntities", Entity[].class);
        Entity[] updatedEntities = getParameter(request, "updatedEntities", Entity[].class);
        Page[] deletedPages = getParameter(request, "deletedPages", Page[].class);
        Page[] newPages = getParameter(request, "newPages", Page[].class);
        Page[] updatedPages = getParameter(request, "updatedPages", Page[].class);
        Lecture lecture = getParameter(request, "lecture", Lecture.class);
        
        // Handle images.
        for (Page page : newPages)
            handleImage(page);
        for (Page page : updatedPages)
            handleImage(page);
        for (Entity entity : newEntities)
            handleImage(entity);
        for (Entity entity : updatedEntities)
            handleImage(entity);
        
        // Perform all of the deletions.
        for (Entity entity : deletedEntities)
            lectureDB.deleteEntity(
                    entity.getEntityID(), 
                    entity.getPageID(), 
                    entity.getLectureID()
            );
        for (Page page : deletedPages)
            lectureDB.deletePage(
                    page.getLectureID(), 
                    page.getPageID()
            );
        
        // Perform all of the updates.
        for (Entity entity : updatedEntities)
            lectureDB.updateEntity(entity);
        for (Page page : updatedPages)
            lectureDB.updatePage(page);
        lectureDB.updateLecture(lecture);
        
        // Perform all of the additions.
        for (Page page : newPages)
            lectureDB.addPage(page);
        for (Entity entity : newEntities)
            lectureDB.addEntity(entity);
        
        // Create a JSON strings for the return objects.
        Gson gson = new Gson();
        Page[] pages = lectureDB.getPages(lecture.getLectureID());
        String pagesJSON = gson.toJson(pages);
        String lectureJSON = gson.toJson(lecture);
        
        // Create the full JSON string for the final return object.
        String json = String.format(
                "{ \"pages\": %s, \"lecture\": %s }", 
                pagesJSON,
                lectureJSON
        );
        
        // Write the object to the response.
        try {
            response.getWriter().write(json);
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }
    
    /**
     * Retrieves the correctly constructed parameter from the request.
     * 
     * @param <T> the Java type of the parameter.
     * @param request the HttpServletRequest object that contains the parameters.
     * @param paramName the name of the parameter in the request.
     * @param type the class for the Java type. This can even be an array class.
     * @return the retrieved parameter.
     */
    private <T> T getParameter(HttpServletRequest request, String paramName, 
            Class<T> type) {
        // Retrieve the JSON parameter.
        String json = request.getParameter(paramName);
        
        // Convert the JSON string into a Lecture object.
        Object param = new Gson().fromJson(json, type);
        
        // Cast the parameter to the type.
        return (T)param;
    }
    
    /**
     * Checks if the specified entity contains image data. If it does, the
     * image is saved to a file and the path to the image is set as the entity's
     * content.
     * 
     * @param entity the entity to check.
     */
    private void handleImage(Entity entity) {
        // Ensure the entity's content type is image.
        if (!"image".equals(entity.getEntityType()))
            return;
        
        // Check if the page has an image to be saved.
        if (!"data".equals(entity.getEntityContent().substring(0, 5)))
            return;
        
        // Ensure a folder exists to store the image.
        String directoryPath = String.format(
                "%sLecture%s/Page%s/",
                imagePath,
                entity.getLectureID(),
                entity.getPageID()
        );
        File directory = new File(directoryPath);
        if (!directory.exists())
            directory.mkdir();
        
        // Create a path for the image.
        String imagePath = directoryPath + (directory.listFiles().length + 1) + ".png";
        
        // Save the image.
        saveImage(entity.getEntityContent(), imagePath);
        
        // Replace the image with the path to the image.
        entity.setEntityContent(imagePath);
    }
    
    /**
     * Saves the page's image data to an image file and swaps the image data
     * with a URL to the file.
     * 
     * @param page the page object to handle the image for.
     */
    private void handleImage(Page page) {
        // Check if the page has an image to be saved.
        if (!"data".equals(page.getPageAudioURL().substring(0, 5)))
            return;
        
        // Ensure a folder exists to store the image.
        String directoryPath = String.format(
                "%sLecture%s/",
                imagePath,
                page.getLectureID()
        );
        File directory = new File(directoryPath);
        if (!directory.exists())
            directory.mkdir();
        
        // Create a path for the image.
        String imagePath = directoryPath + (directory.listFiles().length + 1) + ".png";
        
        // Save the image.
        saveImage(page.getPageAudioURL(), imagePath);
        
        // Repace the image with the path to the image.
        page.setPageAudioURL(imagePath);
    }
    
    /**
     * Converts the specified URL Data into an image and saves the image to a
     * file.
     * 
     * @param urlData the Base64-encoded URL Data representing the image.
     */
    private void saveImage(String urlData, String fileName) {
        // Cut out the header from the url data.
        urlData = urlData.substring(urlData.indexOf(",") + 1);
        
        // JSON places backslashes in the URL. Get rid of them.
        urlData = urlData.replace("\\", "");
        
        // Decode the URL Data into binary.
        byte[] binary = Base64.getDecoder().decode(urlData);
                
        // Attempt to create a new input stream for the binary data.
        try (ByteArrayInputStream imageIn = new ByteArrayInputStream(binary)) {
            // Create a new image from the binary data.
            BufferedImage image = ImageIO.read(imageIn);
                        
            // Create a new file to save the image to.
            File imageFile = new File(fileName);
                        
            // Save the image to a file.
            ImageIO.write(image, "png", imageFile);
            
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }
}
