/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Model;

import java.io.Serializable;

/**
 *
 * @author njt5112
 */
public class Entity implements Serializable {
    private String lectureID;
    private String pageID;
    private String entityID;
    private String entityType;
    private String entityX;
    private String entityY;
    private String entityZ;
    private String entityContent;
    private String entityAnimation;

    public String getLectureID() {
        return lectureID;
    }

    public void setLectureID(String lectureID) {
        this.lectureID = lectureID;
    }

    public String getPageID() {
        return pageID;
    }

    public void setPageID(String pageID) {
        this.pageID = pageID;
    }

    public String getEntityID() {
        return entityID;
    }

    public void setEntityID(String entityID) {
        this.entityID = entityID;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getEntityContent() {
        return entityContent;
    }

    public void setEntityContent(String entityContent) {
        this.entityContent = entityContent;
    }

    public String getEntityAnimation() {
        return entityAnimation;
    }

    public void setEntityAnimation(String entityAnimation) {
        this.entityAnimation = entityAnimation;
    }

    public String getEntityX() {
        return entityX;
    }

    public void setEntityX(String entityX) {
        this.entityX = entityX;
    }
    
    public String getEntityY() {
        return entityY;
    }

    public void setEntityY(String entityY) {
        this.entityY = entityY;
    }
    
    public String getEntityZ() {
        return entityZ;
    }

    public void setEntityZ(String entityZ) {
        this.entityZ = entityZ;
    }
}
