package br.com.jcpm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingsResponseDTO {
    private String championship;
    private List<TeamStandingDTO> teams;
}
