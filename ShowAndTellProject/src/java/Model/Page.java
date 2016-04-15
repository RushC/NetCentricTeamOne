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
public class Page implements Serializable {
    private String lectureID;
    private String pageID;
    private String pageSequence;
    private String pageAudioURL;

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

    public String getPageSequence() {
        return pageSequence;
    }

    public void setPageSequence(String pageSequence) {
        this.pageSequence = pageSequence;
    }

    public String getPageAudioURL() {
        return pageAudioURL;
    }

    public void setPageAudioURL(String pageAudioURL) {
        this.pageAudioURL = pageAudioURL;
    }
}
