package edu.nus.market.pojo.ResEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailMessage {
    String to;

    String title;

    String content;


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("UpdateMessage{")
            .append("to=").append(to).append('\'')
            .append(", title='").append(title).append('\'')
            .append(", content='").append(content).append('\'')
            .append('}');
        return sb.toString();
    }
}
