package backend;

import ch.qos.logback.core.encoder.LayoutWrappingEncoder;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.jsoup.nodes.Document;

import java.util.Arrays;

public class LegendaryItem extends Item{


    private Item[] components;

    public LegendaryItem(Document itemWiki) {
        super(itemWiki);
        components = itemData.getComponents(itemWiki);
    }


    // for jackson to deserialize
    public LegendaryItem(){
        super();
    }


    public void setComponents(Item[] components) {
        this.components = components;
    }

    public Item[] getComponents() {
        return components;
    }

    //used to check if both LegendaryItem's have identical components. the components may be in different order, although containing the same components; (depends on orientation of items made by user)
    // sort them so that they are same order if they were identical.
    // TODO: implement sort criteria (maybe sort alphabetically)

    public boolean equals(LegendaryItem o) {
        // if compared with itself
        if (this == o) return true;
        // unequal if different class/null
        if (o == null || getClass() != o.getClass()) return false;

        LegendaryItem other = o;

        // make a copy of both LegendaryItem.components to prevent mutation when sorted
        Item[] thisCopy = Arrays.stream(this.components).toArray(Item[]::new);
        Item[] otherCopy = Arrays.stream(other.components).toArray(Item[]::new);

        Arrays.sort(thisCopy);
        Arrays.sort(otherCopy);

        return Arrays.equals(thisCopy, otherCopy);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(components);
    }


//    public Node<Item> getComponents(){
//         return components;
//     }
}
