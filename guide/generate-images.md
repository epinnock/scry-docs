# Generate images in the dashboard

The dashboard's **Generate** page makes pictures from a text prompt. Each round gives you four to choose from, and you can refine one or make it larger. This page covers the shape of the pictures and the History of everything you generate. Credits are explained in [How credits work](/guide/credits).

## Choose a shape

The prompt panel has an **Aspect ratio** dropdown. Pick the shape before you press Generate. It starts on 1:1 (square), and the page remembers your last choice in your browser.

| Aspect ratio | Shape | Size in pixels |
|---|---|---|
| 1:1 | Square | 1024 x 1024 |
| 3:2 | Landscape | 1248 x 832 |
| 2:3 | Portrait | 832 x 1248 |
| 4:3 | Landscape | 1184 x 864 |
| 3:4 | Portrait | 864 x 1184 |
| 16:9 | Wide | 1344 x 768 |
| 9:16 | Tall | 768 x 1344 |

- **Every picture in a round has the shape you chose.** The four tiles show at that shape, and the round's header shows the ratio next to your prompt.
- **The price is the same for every shape.** A wide picture costs the same as a square one.
- **Refine and Make larger keep the shape.** They work on a picture you already have, so the result has the same shape as that picture. Choosing another aspect ratio only changes your next new Generate. **Make larger** doubles the size, so a 16:9 picture of 1344 x 768 becomes 2688 x 1536.
- **Compare uses the shape you chose for every tile.** All the tiles in a round are the same size, so the shape never gives away which model made which picture.

Rounds you made before shapes were available stay square.

## History

**History** keeps every picture you generate, not only the ones you carried on with. Open **Generate**, then **History**. Pictures are listed newest first, and each card says **Selected** or **Unselected** at the end of its details line.

![Generate History with All chosen, showing selected and unselected pictures together](/images/generate-history/history-all.png)

### Filter the list

The filter row sits above the cards. You can choose one filter at a time:

| Filter | What it shows |
|---|---|
| **All** | Every picture, selected and unselected. This is where History opens. |
| **Selected** | The picture you picked in each run, whether or not you carried on from it. |
| **Unselected** | The other pictures from each run. |
| **This month** | Pictures from this calendar month, selected and unselected. |
| **Larger only** | Pictures you made larger. |

The filter you are on shows how many cards it lists, for example **Unselected · 10**.

### What Selected and Unselected mean

- **Selected** is the picture you picked in a run. It stays Selected even if you only downloaded it and never carried on.
- **Unselected** is every other picture from a run. When a run had no good picture and you chose **None are good**, or you did not pick before the run expired, all four of its pictures are Unselected.

A picture that failed to make is not listed. A run you can still pick from is not listed until you pick, or until it expires after 8 minutes.

![Generate History filtered to Unselected](/images/generate-history/history-unselected.png)

### What you can do with an unselected picture

An unselected card has three links:

- **Download** saves the picture.
- **Use as reference** puts the picture into the prompt panel as a reference for your next Generate.
- **Delete** removes the picture for good. The other pictures from the same run stay.

![The Delete this picture confirmation](/images/generate-history/history-delete-confirm.png)

You cannot carry on a session from an unselected picture yet, so it has no **Continue**. Use it as a reference instead.

### Older runs

Runs you made before History kept every picture have no saved prompt. Their unselected cards are titled **Prompt not saved**.

### How long pictures are kept

Pictures are removed automatically after 6 months, selected and unselected alike. The line at the bottom of History says so.
