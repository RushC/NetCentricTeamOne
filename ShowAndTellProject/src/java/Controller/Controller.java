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
 * @author njt5112, Caleb Rush
 */
public class Controller extends HttpServlet {
    //public static final String NAME_HEADER = "LECTURE_NAME"   ; // header value for the name of a lecture
    //public static final String ID_HEADER   = "LECTURE_ID"      ; // header value for the id of a lecture
    private final CrudDao lectureDB = new CrudDao();
    private final Gson gson = new Gson();
    // The path for the images folder where all of the images are stored.
    private String imagePath;
    
    /**
     * Adds a page based on the parameters found in the specified request.
     * 
     * @param request the request object containing the parameters.
     */
    private void addEntity(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the parameters from the request.
        Entity entity = getParameter(request, "entity", Entity.class);
        
        // Handle any images for the entity.
        handleImage(entity);
        
        // Insert the entity into the database.
        entity.setEntityID("" + lectureDB.addEntity(entity));
                
        // Convert the entity to a JSON string.
        String entityJSON = gson.toJson(entity);
        
        // Write the entity as the response body.
        writeResponse(response, entityJSON);
    }
    
    /**
     * Adds a lecture based on the parameters found in the specified request.
     * 
     * @param request the request object containing the parameters.
     */
    private void addLecture(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the parameters from the request.
        Lecture lecture = getParameter(request, "lecture", Lecture.class);
        
        // Insert the lecture into the database.
        lecture.setLectureID("" + lectureDB.addLecture(lecture));
        
        // Convert the lecture to a JSON string.
        String lectureJSON = gson.toJson(lecture);
        
        // Write the lecture as the response body.
        writeResponse(response, lectureJSON);
    }
    
    /**
     * Adds a page based on the parameters found in the specified request.
     * 
     * @param request the request object containing the parameters.
     */
    private void addPage(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the parameters from the request.
        Page page = getParameter(request, "page", Page.class);
        
        // Handle any images for the page.
        handleImage(page);
        
        // Insert the page into the database.
        page.setPageID("" + lectureDB.addPage(page));
        
        // Convert the page to a JSON string.
        String pageJSON = gson.toJson(page);
        
        // Write the page as the response body.
        writeResponse(response, pageJSON);
    }
    
    /**
     * Deletes the entity based on the parameters found in the specified
     * request.
     * 
     * @param request the request object containing the parameters.
     */
    private void deleteEntity(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the parameter from the request.
        Entity entity = getParameter(request, "entity", Entity.class);
        
        // Delete the entity from the database.
        lectureDB.deleteEntity(entity.getEntityID(), entity.getPageID(), 
                entity.getLectureID());
        
        response.setStatus(200);
    }
    
    /**
     * Deletes the lecture based on the parameters found in the specified
     * request.
     * 
     * @param request the request object containing the parameters.
     */
    private void deleteLecture(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the parameter from the request.
        Lecture lecture = getParameter(request, "lecture", Lecture.class);
        
        // Delete the lecture from the database.
        lectureDB.deleteLecture(lecture.getLectureID());
        
        response.setStatus(200);
    }
    
    /**
     * Deletes the page based on the parameters found in the specified
     * request.
     * 
     * @param request the request object containing the parameters.
     */
    private void deletePage(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the parameter from the request.
        Page page = getParameter(request, "page", Page.class);
        
        // Delete the lecture from the database.
        lectureDB.deletePage(page.getLectureID(), page.getPageID());
        
        response.setStatus(200);
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
        // Construct the image path in case it is needed.
        imagePath = getServletContext().getRealPath("/") + "views/images/";
        
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
                
                // Add an entity to the database.
                case "addEntity":
                    addEntity(request, response);
                    break;
                    
                // Add a lecture to the database.
                case "addLecture":
                    addLecture(request, response);
                    break;
                    
                // Add a page to the database.
                case "addPage":
                    addPage(request, response);
                    break;
                
                // Delete the requested entity from the database.
                case "deleteEntity":
                    deleteEntity(request, response);
                    break;
                    
                // Delete the requested lecture from the database.
                case "deleteLecture":
                    deleteLecture(request, response);
                    break;
                    
                // Delete the requested page from the database.
                case "deletePage":
                    deletePage(request, response);
                    break;
                    
                // Retrieve the entities for the requested page.
                case "getEntities":
                    getEntities(request, response);
                    break;
                    
                // Retrieve the lectures from the database.
                case "getLectures":
                    getLectures(request, response);
                    break;   
                
                // Retrieve the pages for the requested lecture.
                case "getPages":
                    getPages(request, response);
                    break;
                    
                // Update an exisiting entity in the database.
                case "updateEntity":
                    updateEntity(request, response);
                    break;
                                        
                // Update an exisiting lecture in the database.
                case "updateLecture":
                    updateLecture(request, response);
                    break;
                    
                // Update an exisiting page in the database.
                case "updatePage":
                    updatePage(request, response);
                    break;
                    
                // Any other action is a bad request.
                default:
                    response.sendError(400);
            }
        }
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
        String entitiesJSON = gson.toJson(entities);
        
        // Write the JSON string to the response.
        writeResponse(response, entitiesJSON);
    }
    
    /**
     * Retrieves the Lectures from the database.
     * 
     * @param request the HTTP request from the client to the server.
     * @param response the HTTP response from the server to the client.
     */
    private void getLectures(HttpServletRequest request,
            HttpServletResponse response) {
        // Retrieve all of the Lecture objects from the database.
        Lecture[] lectures = lectureDB.getLectures();
        
        // Convert the lectures to a JSON string.
        String lecturesJSON = gson.toJson(lectures);
        
        // Write the JSON string to the response.
        writeResponse(response, lecturesJSON);
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
        
        // Ensure the lecture has a valid ID.
        if (lecture.getLectureID() == null) {
            System.err.println("Null ID");
            return;
        }
        
        // Retrieve all of the pages in the lecture.
        Page[] pages = lectureDB.getPages(lecture.getLectureID());
        
        System.out.println(pages.length);
        
        // Convert the pages to a JSON string.
        String pagesJSON = gson.toJson(pages);
        
        System.out.println(pagesJSON);
        
        // Set the JSON string as the response body.
        writeResponse(response, pagesJSON);
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
        
        System.out.println("Param " + paramName + ": " + json);
        
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
        if (entity.getEntityContent() == null
                || entity.getEntityContent().length() < 4
                || !"data".equals(entity.getEntityContent().substring(0, 4)))
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
        if (page.getPageAudioURL() == null
                || page.getPageAudioURL().length() < 4
                || !"data".equals(page.getPageAudioURL().substring(0, 4)))
            return;
        
        // Ensure a folder exists to store the image.
        String directoryPath = String.format(
                "Lecture%s/",
                page.getLectureID()
        );
        File directory = new File(imagePath + directoryPath);
        if (!directory.exists())
            directory.mkdir();
        
        // Create a path for the image.
        String imagePath = "" + (directory.listFiles().length + 1) + ".png";
        
        // Save the image.
        saveImage(page.getPageAudioURL(), 
                this.imagePath + directoryPath + imagePath);
        
        // Replace the image with the path to the image.
        page.setPageAudioURL("/views/images/" + directoryPath + imagePath);
    }
    
    /**
     * Updates the entity found in the request object.
     * 
     * @param request the HttpServletRequest object.
     * @param response the HttpServletResponse object.
     */
    private void updateEntity(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the entity object from the request.
        Entity entity = getParameter(request, "entity", Entity.class);
        
        // Handle any images in the page.
        handleImage(entity);
        
        // Update the entity in the database.
        lectureDB.updateEntity(entity);
        
        // Reload the entity from the database.
        entity = lectureDB.getEntity(entity.getEntityID(), entity.getPageID(), 
                entity.getLectureID());
        
        // Convert the entity to a JSON string.
        String entityJSON = gson.toJson(entity);
        
        // Write the json as the response.
        writeResponse(response, entityJSON);
    }
    
    /**
     * Updates the lecture found in the request object.
     * 
     * @param request the HttpServletRequest object.
     * @param response the HttpServletResponse object.
     */
    private void updateLecture(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the lecture object from the request.
        Lecture lecture = getParameter(request, "entity", Lecture.class);
               
        // Update the lecture in the database.
        lectureDB.updateLecture(lecture);
        
        // Reload the lecture from the database.
        lecture = lectureDB.getLecture(lecture.getLectureID());
        
        // Convert the lecture to a JSON string.
        String lectureJSON = gson.toJson(lecture);
        
        // Write the json as the response.
        writeResponse(response, lectureJSON);
    }
    
//    /**
//     * Updates the lectures based on the parameters found in the specified
//     * request and sends a response.
//     * 
//     * @param request the request object containing the parameters.
//     * @param response the response object to send the response through.
//     */
//    private void updateLecture(HttpServletRequest request, 
//            HttpServletResponse response) {
//        // Retrieve all of the parameters from the request.
//        Entity[] deletedEntities = getParameter(request, "deletedEntities", Entity[].class);
//        Entity[] newEntities = getParameter(request, "newEntities", Entity[].class);
//        Entity[] updatedEntities = getParameter(request, "updatedEntities", Entity[].class);
//        Page[] deletedPages = getParameter(request, "deletedPages", Page[].class);
//        Page[] newPages = getParameter(request, "newPages", Page[].class);
//        Page[] updatedPages = getParameter(request, "updatedPages", Page[].class);
//        Lecture lecture = getParameter(request, "lecture", Lecture.class);
//        
//        // Handle images.
//        for (Page page : newPages)
//            handleImage(page);
//        for (Page page : updatedPages)
//            handleImage(page);
//        for (Entity entity : newEntities)
//            handleImage(entity);
//        for (Entity entity : updatedEntities)
//            handleImage(entity);
//        
//        // Perform all of the deletions.
//        for (Entity entity : deletedEntities)
//            lectureDB.deleteEntity(
//                    entity.getEntityID(), 
//                    entity.getPageID(), 
//                    entity.getLectureID()
//            );
//        for (Page page : deletedPages)
//            lectureDB.deletePage(
//                    page.getLectureID(), 
//                    page.getPageID()
//            );
//        
//        // Perform all of the updates.
//        for (Entity entity : updatedEntities)
//            lectureDB.updateEntity(entity);
//        for (Page page : updatedPages)
//            lectureDB.updatePage(page);
//        lectureDB.updateLecture(lecture);
//        
//        // Perform all of the additions.
//        for (Page page : newPages)
//            lectureDB.addPage(page);
//        for (Entity entity : newEntities)
//            lectureDB.addEntity(entity);
//        
//        // Create a JSON strings for the return objects.
//        Gson gson = new Gson();
//        Page[] pages = lectureDB.getPages(lecture.getLectureID());
//        String pagesJSON = gson.toJson(pages);
//        String lectureJSON = gson.toJson(lecture);
//        
//        // Create the full JSON string for the final return object.
//        String json = String.format(
//                "{ \"pages\": %s, \"lecture\": %s }", 
//                pagesJSON,
//                lectureJSON
//        );
//        
//        // Write the object to the response.
//        try {
//            response.getWriter().write(json);
//        } catch (IOException e) {
//            System.err.println(e.getMessage());
//        }
//    }
    
    /**
     * Updates the lecture found in the request object.
     * 
     * @param request the HttpServletRequest object.
     * @param response the HttpServletResponse object.
     */
    private void updatePage(HttpServletRequest request, 
            HttpServletResponse response) {
        // Retrieve the page object from the request.
        Page page = getParameter(request, "page", Page.class);
        
        // Handle any images in the page.
        handleImage(page);
        
        // Update the page in the database.
        lectureDB.updatePage(page);
        
        // Reload the page from the database.
        page = lectureDB.getPage(page.getPageID(), page.getLectureID());
        
        // Convert the page to a JSON string.
        String pageJSON = gson.toJson(page);
        
        // Write the json as the response.
        writeResponse(response, pageJSON);
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
    
    /**
     * Writes a JSON string as the body of the specified response and sets
     * the status code appropriately.
     * 
     * @param response the HttpServletResponse object.
     * @param json the JSON string to be written as the response body.
     */
    private void writeResponse(HttpServletResponse response, String json) {
        try {
            System.out.println("Writing Response: " + json);
            response.getWriter().write(json);
            response.setStatus(200);
        } catch (IOException e) {
            System.err.println("Error writing response: " + e.getMessage());
            response.setStatus(500);
        }
    }
}
