package org.arnav.bankapp.functions;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

        @GetMapping("/")
        public String home() {
            return "index.jsp"; // Maps to index.jsp
        }
}
