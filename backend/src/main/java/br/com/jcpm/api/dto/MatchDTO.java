package br.com.jcpm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDTO {
    private String homeTeam;
    private String homeLogo;
    private String awayTeam;
    private String awayLogo;
    private String date;
    private String time;
    private Integer homeScore;
    private Integer awayScore;
    private String status; // "SCHEDULED", "LIVE", "FINISHED"
    private String category;
}
