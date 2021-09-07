package backend;


import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;

@RestController
@CrossOrigin
public class SpringController {

	@GetMapping("/randomItem")
    // jackson dependency is included in spring boot web, thus can return a POJO and will automatically serialize into JSON.
	LegendaryItem randomItem() {
		return itemData.getRandomLegendary();
	}


	@PostMapping("checkItem")
	boolean checkItem(@RequestBody String[] userComponents, @RequestParam String itemName){

		return itemData.checkCorrect(userComponents, itemName);
	}


	@PostMapping("randomComponents")
	Item[] getRandomComponents(@RequestBody LegendaryItem userItem, @RequestParam int amount){		// userItem is passed to ensure no duplicate components are returned... this is also to preserve statelessness.
		Item[] xd= itemData.getRandomComponents(userItem, amount);
		return  xd;
	}

}