package com.jamaa.service_users.resolver;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.jamaa.service_users.model.Customer;
import com.jamaa.service_users.model.SuperAdmin;
import com.jamaa.service_users.service.CustomerService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class CustomerQueryResolver {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomerQueryResolver.class);
    
    private final CustomerService customerService;

    @QueryMapping
    public List<Customer> getAllCustomers() {
        logger.info("🔍 Récupération de tous les clients...");
        List<Customer> customers = customerService.getAllCustomers();
                
        logger.info("✅ {} clients récupérés avec URLs pré-signées", customers.size());
        return customers;
    }

    @QueryMapping
    public Customer getCustomerById(@Argument Long id) {
        logger.info("🔍 Récupération du client avec ID: {}", id);
        Customer customer = customerService.getCustomerById(id);
                
        return customer;
    }

    @QueryMapping
    public Customer getCustomerByEmail(@Argument String email) {
        logger.info("🔍 Récupération du client par email: {}", email);
        Customer customer = customerService.getCustomerByEmail(email);
                
        return customer;
    }

    @QueryMapping
    public Customer getCustomerByPhone(@Argument String phone) {
        logger.info("🔍 Récupération du client par téléphone: {}", phone);
        Customer customer = customerService.getCustomerByPhone(phone);
                
        return customer;
    }

    @QueryMapping
    public List<SuperAdmin> getAllSuperAdmins() {
        logger.info("🔍 Récupération de tous les super admins...");
        List<SuperAdmin> superAdmins = customerService.getAllSuperAdmins();
        logger.info("✅ {} super admins récupérés", superAdmins.size());
        return superAdmins;
    }

    @QueryMapping
    public SuperAdmin getSuperAdminById(@Argument Long id) {
        logger.info("🔍 Récupération du super admin avec ID: {}", id);
        SuperAdmin superAdmin = customerService.getSuperAdminById(id);
        
        if (superAdmin != null) {
            logger.info("✅ Super admin trouvé: {}", id);
        } else {
            logger.warn("⚠️ Super admin non trouvé avec ID: {}", id);
        }
        
        return superAdmin;
    }

    @QueryMapping
    public SuperAdmin getSuperAdminByUsername(@Argument String username) {
        logger.info("🔍 Récupération du super admin par username: {}", username);
        SuperAdmin superAdmin = customerService.getSuperAdminByUsername(username);
        
        if (superAdmin != null) {
            logger.info("✅ Super admin trouvé par username");
        } else {
            logger.warn("⚠️ Super admin non trouvé avec username: {}", username);
        }
        
        return superAdmin;
    }
}