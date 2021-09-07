package backend;
;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.Arrays;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// scraper class using jsoup, from: https://leagueoflegends.fandom.com/wiki/League_of_Legends_Wiki
public class itemData {

    private static final String SOURCE = "https://dota2.fandom.com";

    // only supposed to be used for legendary items
    // returns direct descendant children components of item.
    public static Item[] getComponents(Document itemDoc) {

        Elements recipeContainer = itemDoc.select("#mw-content-text > div > table.infobox > tbody > tr:last-child > td > table > tbody tr:last-child > td > div:last-child > div div a");
        // element:last-child: selects last child of element's parent.
        return recipeContainer.stream()
                .map(element -> element.attr("href"))       // map to link then item
                .map(itemLink -> {

                    Item item = null;
                    try {
                        Document doc = Jsoup.connect(SOURCE + itemLink).get();
                         item = new Item(Jsoup.connect(SOURCE + itemLink).get());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return item;
                })
                .toArray(Item[]::new);



    }


    protected static String getName(Document doc){
        Element title = doc.select(".page-header__title").first();
        return title.text();

    }
    protected static int getPrice(Document doc){
        Element costContainer = doc.select("#mw-content-text > div > table.infobox > tbody > tr > th > div[style*=\"display:flex\"]").first();
        if (costContainer.text().contains("N/A")){
            return 0;
        }
        String[] words = costContainer.text().split("\\s");
        return Integer.valueOf(words[1]);
    }

    protected static String[] getStats(Document doc) {

        // hard to parse with only css selector so had to use jsoup DOM methods
        Element stats = doc.select("tbody > tr > td > a[href*=\"/wiki\"]").first();
        // for Item: recipe
        if (stats == null){
            return new String[0];
        }
        Element statsContainer = stats.parent();

        //(?<=[a-zA-Z]): positive lookbehind for letters
        //(?=[+]) positive lookahead for "+"
        // regex summary: match any whitespace inbetween a letter and "+".
        //ex: +14 Strength +14 Agility +14 Intelligence, would be split up in a array correctly
        return statsContainer.text().split("(?<=[a-zA-Z])\\s(?=[+])");

    }

    protected static String getIconHD(Document doc) {

        Element icon = doc.select("#itemmainimage > a").first();
        return icon.attr("href").split("/revision")[0];
    }

    public static LegendaryItem getRandomLegendary(){
        Document upgradedItem = null;
        try {
             upgradedItem = Jsoup.connect("https://dota2.fandom.com/wiki/Items").get();
        } catch (IOException e) {
            e.printStackTrace();
        }
        // different "upgraded items" are stored in different categories, ranging from: div:nth-child(18) to div:nth-child(28), going by 2's.

        int[] categoryChildren = {16, 18, 20, 22, 24, 26};
        Random random = new Random();
        int rand = random.nextInt(categoryChildren.length);

        Elements randomItemCategory = upgradedItem.select(String.format("#mw-content-text > div > div:eq(%d) > div> a:first-child", categoryChildren[rand]));

        // pick a random item from that category
        rand = random.nextInt(randomItemCategory.size());
        String item = randomItemCategory.get(rand).attr("href");

        Document doc = null;

        try {
             doc = Jsoup.connect(SOURCE + item).get();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new LegendaryItem(doc);



    }

    public static boolean checkCorrect(String[] userComponents, String itemName){
        Document doc = null;

        try {
             doc = Jsoup.connect(SOURCE + "/wiki/" + itemName).get();
        } catch (IOException e) {
            return false;
        }


        LegendaryItem correctItem = new LegendaryItem(doc);
        LegendaryItem userItem = new LegendaryItem();

        Item items[] = new Item[userComponents.length];

        for (int i=0; i<items.length; i++){
            items[i] = new Item(userComponents[i]);
        }


        userItem.setComponents(items);

        return correctItem.equals(userItem);


    }

    public static Item[] getRandomComponents(LegendaryItem Item, int amount){

        Item[] randomComp= new Item[amount];
        int count =0;

        while(true){
            LegendaryItem legendary = getRandomLegendary();

             if (!legendary.equals(Item)){
                     Item[] comp = legendary.getComponents();
                    // recipe will always be last component

                     for (int i=0; i<comp.length; i++) {
                         // short circuit evaluation; java checks first argument (i==comp.length-1) and if false, doesn't bother to check the rest of the statement.
                         if (i==comp.length-1 && comp[i].getName().equals("Recipe") || Arrays.stream(randomComp).anyMatch(comp::equals)) { // no recipes / less duplicates

                             continue;   // skip iteration
                         }
                             if (count < amount) {
                                 randomComp[count] = comp[i];
                                 count++;
                             } else {
                                 return randomComp;
                             }


                     }
                 }
        }


    }





}
