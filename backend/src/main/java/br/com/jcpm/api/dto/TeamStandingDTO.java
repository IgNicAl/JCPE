package br.com.jcpm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamStandingDTO {
    private Integer position;
    private String name;
    private String logo;
    private Integer points;
    private Integer played;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsFor;
    private Integer goalsAgainst;
}
