package br.com.jcpm.api.dto;

public class PointsResponse {
    private long totalSeconds;
    private int points;

    public PointsResponse() {
    }

    public PointsResponse(long totalSeconds, int points) {
        this.totalSeconds = totalSeconds;
        this.points = points;
    }

    public long getTotalSeconds() {
        return totalSeconds;
    }

    public void setTotalSeconds(long totalSeconds) {
        this.totalSeconds = totalSeconds;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }
}
