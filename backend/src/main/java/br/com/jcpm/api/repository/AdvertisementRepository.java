package br.com.jcpm.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.Advertisement;

/**
 * Repository para gerenciar operações de banco de dados da entidade Advertisement.
 */
@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, UUID> {

    /**
     * Busca todos os anúncios ativos.
     * @return Lista de anúncios com isActive = true
     */
    List<Advertisement> findByIsActiveTrue();

    /**
     * Busca anúncios por localização.
     * @param location Localização do anúncio ('id' ou 'class')
     * @return Lista de anúncios na localização especificada
     */
    List<Advertisement> findByLocation(String location);

    /**
     * Busca anúncios ativos por localização.
     * @param location Localização do anúncio ('id' ou 'class')
     * @return Lista de anúncios ativos na localização especificada
     */
    List<Advertisement> findByIsActiveTrueAndLocation(String location);
}
