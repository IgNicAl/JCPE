package br.com.jcpe.api.dto;

public class ScreenTimeRequest {
    private long seconds;

    public ScreenTimeRequest() {
    }

    public ScreenTimeRequest(long seconds) {
        this.seconds = seconds;
    }

    public long getSeconds() {
        return seconds;
    }

    public void setSeconds(long seconds) {
        this.seconds = seconds;
    }
}
