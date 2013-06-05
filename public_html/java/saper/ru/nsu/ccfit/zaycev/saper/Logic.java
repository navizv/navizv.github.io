package ru.nsu.ccfit.zaycev.saper;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import ru.nsu.ccfit.zaycev.saper.GUI.GUI;

/**
 * Class that controls cooperation of logical minefield (fieldManager) and
 * visible minefield (fieldInterface). <br>
 * Listens to actions that can change logical minefield and also actions that
 * can reset/resize minefield <br>
 * 
 * @author Ivan
 *  
 */
public class Logic {
    /**
     * Class of listener to mouse actions on cell of minefield
     * 
     * @author Ivan
     *  
     */
    public class MyMouseAction extends MouseAdapter {
        /**
         * x coord of cell
         */
        private final int x;

        /**
         * y coord of cell
         */
        private final int y;

        /**
         * Set coords of cell which listener will be listening to
         * 
         * @param i -
         *            x coord
         * @param j -
         *            y coord
         */
        public MyMouseAction(int i, int j) {
            x = i;
            y = j;
        }

        public void mousePressed(MouseEvent e) {
            // TODO Auto-generated method stub
            if (gameover)
                return;// if game is over, do nothing

            if ((e.getModifiersEx() == 5120)) // Both left and right buttons
                // are pressed
                watchAroundCell(x, y);
            else if ((e.getModifiersEx() == 1024)) // Left button is pressed
                if (fieldManager.isCellOpenable(x, y))
                    fieldInerface.putBlankButton(x, y);
        }

        public void mouseReleased(MouseEvent e) {
            // TODO Auto-generated method stub
            if (gameover)
                return;// if game is over, do nothing

            if (e.getModifiersEx() == 0) {// Left button is pressed
                if (fieldManager.isCellOpenable(x, y)) {
                    if (gamestart) {
                        fieldInerface.timestart();// if the game just started,
                        // start timer
                        gamestart = false;
                    }
                    pushCell(x, y);
                }

            } else if (e.getModifiersEx() == 256) {// Right button is pressed
                if (fieldManager.isCellOpenable(x, y)) {// Button pressed the
                    // first time
                    fieldManager.markCell(x, y);
                    fieldInerface.putMarkToButton(x, y);
                    fieldInerface.decrement();
                } else if (fieldManager.isCellMarked(x, y)) {// Button
                    // pressed the
                    // second time
                    fieldManager.unmarkCell(x, y);
                    fieldInerface.putUnMarkToButton(x, y);
                    fieldInerface.increment();
                }
            } else if ((e.getModifiersEx() == 1024)
                    || (e.getModifiersEx() == 4096))// Both left and right
                // buttons are pressed
                watchCell(x, y);

            if (fieldManager.isFieldOpened())// if all field is opened
                victory();
        }
    }

    /**
     * 
     * Class of listeners to actions which can reset/resize field
     * 
     * @author Ivan
     *  
     */
    public class ResetAction implements ActionListener {
        private final int width;

        private final int height;

        private final int mines;

        /**
         * Create listener that can only reset minefield
         *  
         */
        public ResetAction() {
            width = height = mines = 0;
        }

        /**
         * Create listener that can resize and reset the minefield
         * 
         * @param x -
         *            new width of field
         * @param y -
         *            new height of field
         * @param z -
         *            new quantity of mines
         */
        public ResetAction(int x, int y, int z) {
            width = x;
            height = y;
            mines = z;
        }

        public void actionPerformed(ActionEvent e) {
            // TODO Auto-generated method stub
            if (width == 0)
                reset();
            else
                reset(width, height, mines);
        }

    }

    /**
     * Logical(not visible)minefield
     */
    private Manager fieldManager;

    /**
     * Visible minefield
     */
    private GUI fieldInerface;

    private int heightOfField;

    private int widthOfField;

    private int numbOfMine;

    /**
     * Indicates is game over
     */
    private boolean gameover = false;

    /**
     * true - game isn't playing yet <br>
     * false - game is plaing
     */
    private boolean gamestart = true;

    /**
     * Hash table of high scores and names of champions
     */
    //volatile private Properties best = new Properties();

    /**
     * Type of the game(beginner,intermediate,expert or null(otherwise))
     */
    private String type = new String("beginner");

    public int getWidthOfField() {
        return widthOfField;
    }

    public int getHeightOfField() {
        return heightOfField;
    }

    public int getNumbOfMine() {
        return numbOfMine;
    }

    /**
     * 
     * @return hash table of high scores and names of champions
     */
    //public Properties getBest() {
      //  return best;
    //}

   /* public void setBest() {
        try {
            best.load(new FileInputStream("best.properties"));// Get
            // high
            // scores
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }*/

    /**
     * 
     * @param width
     * @param height
     * @param mine -
     *            number of mines
     */
    public Logic(int width, int height, int mine,GUI in) {
        widthOfField = width;
        heightOfField = height;
        numbOfMine = mine;

        // Create new visible and logical fields
        //fieldInerface = new GUI(widthOfField, heightOfField, this);
        fieldManager = new Manager(widthOfField, heightOfField, numbOfMine);
        fieldInerface=in;
        //setBest();
    }

    public void victory() {
        // TODO Auto-generated method stub
        // //System.out.println("Greetings!");
        fieldInerface.setPleasedSmile();
        fieldInerface.timestop();
        int result = fieldInerface.timeGet();
        /*try {
            if (result < Integer.parseInt(best.getProperty(type))) {
                best.setProperty(type, Integer.toString(result));
                fieldInerface.makeChampionWindow(type);
            }
        } catch (NullPointerException e) {
        } catch (NumberFormatException e) {
            best.setProperty(type, Integer.toString(result));
            fieldInerface.makeChampionWindow(type);
        }*/

        gamestart = true; // new game isn't started yet!
        for (int j = 0; j < heightOfField; j++)
            for (int i = 0; i < widthOfField; i++)
                if (fieldManager.isCellMined(i, j))
                    if (!fieldManager.isCellMarked(i, j)) {
                        fieldInerface.putMarkToButton(i, j);
                        fieldInerface.decrement();
                    }
        gameover = true; // game is over!!
    }

    /**
     * Makes all cells around (x,y) blank
     * 
     * @param x
     * @param y
     */
    public void watchAroundCell(int x, int y) {
        // TODO Auto-generated method stub
        if (!(fieldManager.isCellOpenable(x, y) || fieldManager.isCellMarked(x,
                y)))
            for (int i = x - 1; i < x + 2; i++)
                for (int j = y - 1; j < y + 2; j++)
                    if ((i >= 0) && (i < widthOfField) && (j >= 0)
                            && (j < heightOfField))

                        if (fieldManager.isCellOpenable(i, j))
                            fieldInerface.putBlankButton(i, j);
    }

    /**
     * If number of marks around (visible)cell equal to number of mines around
     * (logical)cell open all cells around <br>
     * Do nothing otherwise
     * 
     * @param x
     * @param y
     *            (x,y) - coords of the cell
     */
    public void watchCell(int x, int y) {
        // TODO Auto-generated method stub
        // Disable consequences of watchAroundCell
        for (int i = x - 1; i < x + 2; i++)
            for (int j = y - 1; j < y + 2; j++)
                if ((i >= 0) && (i < widthOfField) && (j >= 0)
                        && (j < heightOfField))

                    if (fieldManager.isCellOpenable(i, j))
                        fieldInerface.putUnBlankButton(i, j);

        if (!(fieldManager.isCellOpenable(x, y) || fieldManager.isCellMarked(x,
                y))) {// If cell is opened
            // Checkout If number of marks around (visible)cell equal to number
            // of mines around (logical)cell open all cells around
            int k = 0;
            for (int i = x - 1; i < x + 2; i++)
                for (int j = y - 1; j < y + 2; j++)
                    if ((i >= 0) && (i < widthOfField) && (j >= 0)
                            && (j < heightOfField))

                        if (fieldManager.isCellMarked(i, j))
                            k++;
            // if it's true, open all cells around
            if (k == fieldManager.getEnv(x, y))
                for (int i = x - 1; i < x + 2; i++)
                    for (int j = y - 1; j < y + 2; j++)
                        if ((i >= 0) && (i < widthOfField) && (j >= 0)
                                && (j < heightOfField))
                            if (fieldManager.isCellOpenable(i, j))
                                pushCell(i, j);
        }
    }

    /**
     * Push the cell <br>
     * If cell isn't mined and there is no mines around the cell push all it's
     * neighbours
     * 
     * @param x
     * @param y
     */
    public void pushCell(int x, int y) {

        if (fieldManager.isCellMined(x, y)) {
            fieldInerface.putLethalMineToButton(x, y);
            death(x, y);
            return;
        }

        fieldManager.openCell(x, y);
        fieldInerface.putEnvToButton(x, y, (int) fieldManager.getEnv(x, y));
        if (fieldManager.getEnv(x, y) == 0)
            for (int i = x - 1; i < x + 2; i++)
                for (int j = y - 1; j < y + 2; j++)
                    if ((i >= 0) && (i < widthOfField) && (j >= 0)
                            && (j < heightOfField))
                        if (fieldManager.isCellOpenable(i, j))
                            pushCell(i, j);
    }

    /**
     * Show all not-marked and wrong-marked mines
     * 
     * @param x
     * @param y
     *            (x,y) - coords of lethal mine
     */
    private void death(int x, int y) {
        // TODO Auto-generated method stub
        fieldInerface.setSadSmile();
        fieldInerface.timestop();
        gamestart = true;
        for (int j = 0; j < heightOfField; j++)
            for (int i = 0; i < widthOfField; i++)
                if ((i != x) || (j != y)) {
                    if (fieldManager.isCellMined(i, j))
                        if (!fieldManager.isCellMarked(i, j))
                            fieldInerface.putMineToButton(i, j);
                        else
                            ;
                    else if (fieldManager.isCellMarked(i, j))
                        fieldInerface.putMistakeToButton(i, j);
                }
        gameover = true;
    }

    /**
     * Perform new listener to the button with coords (b,c)
     * 
     * @param b
     * @param c
     * @return
     */
    public MouseListener newMyMouseAction(int b, int c) {
        return new MyMouseAction(b, c);
    }

    /**
     * Reset game
     *  
     */
    public void reset() {
        fieldInerface.timereset();
        gamestart = true;
        fieldManager = new Manager(widthOfField, heightOfField, numbOfMine);
        fieldInerface.resetPanel();
        gameover = false;
    }

    /**
     * Reset game and resize field
     * 
     * @param x -
     *            new width of field
     * @param y -
     *            new height of field
     * @param z -
     *            new quantity of mines
     */
    public void reset(int x, int y, int z) {
        // TODO Auto-generated method stub
        fieldInerface.timereset();
        gamestart = true;
        // Checkout if new parameters are possible
        // If not, change them
        widthOfField = x > 8 ? x : 8;
        heightOfField = y < 30 ? y : 30;
        if (widthOfField > 50)
            widthOfField = 50;
        if (heightOfField < 1)
            heightOfField = 1;
        numbOfMine = z < widthOfField * heightOfField - 1 ? z : widthOfField
                * heightOfField - 1;
        if (numbOfMine < 0)
            numbOfMine = 0;

        // Create new visible and logical fields
        fieldManager = new Manager(widthOfField, heightOfField, numbOfMine);
        fieldInerface.resetPanel(widthOfField, heightOfField);
        gameover = false;
        // Set type of field
        if ((x == 9) && (y == 9) && (z == 10))
            type = new String("beginner");
        else if ((x == 16) && (y == 16) && (z == 40))
            type = new String("intermediate");
        else if ((x == 30) && (y == 16) && (z == 99))
            type = new String("expert");
        else
            type = null;
    }

    /**
     * Perform new reset&resize action listener
     * 
     * @param i -
     *            new width of field
     * @param j -
     *            new height of field
     * @param k -
     *            new quantity of mines
     * @return
     */
    public ActionListener newResetAction(int i, int j, int k) {
        // TODO Auto-generated method stub
        return new ResetAction(i, j, k);
    }

    /**
     * Perform new reset action listener
     * 
     * @return
     */
    public ActionListener newResetAction() {
        // TODO Auto-generated method stub
        return new ResetAction();
    }
}