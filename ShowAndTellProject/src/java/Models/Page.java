/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Models;

import java.io.Serializable;

/**
 *
 * @author njt5112
 */
public class Page implements Serializable {
    private int lectureID;
    private int pageID;
    private String pageSequence;
    private String pageAudioURL;

    public int getLectureID() {
        return lectureID;
    }

    public void setLectureID(int lectureID) {
        this.lectureID = lectureID;
    }

    public int getPageID() {
        return pageID;
    }

    public void setPageID(int pageID) {
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
