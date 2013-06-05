package ru.nsu.ccfit.zaycev.saper;

import java.util.Random;

/**
 * Class of logical(not visible) minefield
 * <br>Contains information of mine positions 
 * and all the cells' numbers of mines around them 
 * @author Ivan
 *
 */
public class Manager {
	public final int HEIGHT_OF_FIELD;

	public final int WIDTH_OF_FIELD;

	/**
	 * Number of mines
	 */
	public final int NUMB_OF_MINES;

	private Cell mineField[][];

	private int numberOfOpenedCell=0;
	
	private final int numberOfOpenableCell;
	
	/**
	 * Class of minefield element
	 * 
	 * @author Ivan
	 *
	 */
	public static class Cell {
		
		/**
		 * -1 - mined;
		 * >=0 - quantity of mines around cell;
		 */
		private int env;
		
		/**
		 * 0 - closed;
		 * 1 - opened;
		 * 2 - marked;
		 */
		private int status;

		private Cell() {
			env = status = 0;
		}
		
		/**
		 * Make cell opened
		 *
		 */
		private void open()
		{
			status = 1;
		}
		
		/**
		 * Mark the cell with flag
		 *
		 */
		private void mark()
		{
			status = 2;
		}
		
		/**
		 * Unmark the cell with
		 *
		 */
		private void unmark() {
			// TODO Auto-generated method stub
			status = 0;
		}

		/**
		 * Returns number of mines around cell if cell isn't mined<br>
		 * -1 - if cell is mined
		 */
		private int getEnv() {
			return env;
		}

		/**
		 * Increments the env field of object cell if cell isn't mined
		 * (using when mine adds near the cell)<br>
		 * If cell is mined do nothing
		 */
		private void incrementEnv() {
			if (env != -1)
				env=env+1;
		}

		/**
		 * Set mine into the cell
		 *
		 */
		private void setMined() {
			env = -1;
		}
		
		/**
		 * 
		 * @return whether cell is marked
		 */
		private boolean isMarked() {
			// TODO Auto-generated method stub
			return (status == 2);
		}
		
		/**
		 * 
		 * @return whether cell is minad
		 */
		private boolean isMined() {
			return (env == -1);
		}
		
		/**
		 * 
		 * @return whether cell is openable
		 */
		private boolean isOpenable()
		{
			return (status == 0);
		}
	}

	/**
	 * Open cell with coords (x,y)
	 * @param x
	 * @param y
	 */
	public void openCell(int x,int y)
	{
		mineField[x][y].open();
		numberOfOpenedCell++;
	}
	
	/**
	 * (x,y) - coords of cell
	 * @param x 
	 * @param y 
	 * @return
	 */
	public boolean isCellOpenable(int x,int y)
	{
		return mineField[x][y].isOpenable();
	}
	
	/**
	 * 
	 * @return whether all the openable cells are opened (victory)
	 */
	public boolean isFieldOpened()
	{
		return numberOfOpenableCell==numberOfOpenedCell;
	}
	
	/**
	 * (x,y) - coords of cell
	 * @param x 
	 * @param y 
	 */	
	public void markCell(int x,int y)
	{
		mineField[x][y].mark();
	}
	
	/**
	 * Create logical minefield with
	 * @param width 
	 * @param height
	 * @param mines - quantity of mines
	 */
	public Manager(int width, int  height, int mines) {
		WIDTH_OF_FIELD = width;
		HEIGHT_OF_FIELD = height;
		NUMB_OF_MINES = mines;
		numberOfOpenableCell = WIDTH_OF_FIELD*HEIGHT_OF_FIELD-NUMB_OF_MINES;

		mineField = new Cell[WIDTH_OF_FIELD][HEIGHT_OF_FIELD];
		for(int i =0 ; i<WIDTH_OF_FIELD;i++)
			for(int j =0 ; j<HEIGHT_OF_FIELD;j++)
				mineField[i][j]=new Cell();
		generateMines();
		printField();
	}

	/**
	 * Print logical field to console
	 *
	 */
	private void printField(){
		for(int j =0 ; j<HEIGHT_OF_FIELD ;j++)
		{
			for(int i =0 ; i<WIDTH_OF_FIELD;i++)
				System.out.print(mineField[i][j].isMined()? "#" : ""+mineField[i][j].getEnv());
			System.out.print("\n");
		}
	}
	
	/**
	 * Auxiliary function.<br>
	 * Generate mines' positions in random order
	 * and set numbers of mines around to not-mined cells
	 *
	 */
	private void generateMines() {
		Random rand = new Random();
		int i, j, x, y;
		for (int n = 0; n < NUMB_OF_MINES; n++) {
			x = rand.nextInt(WIDTH_OF_FIELD);
			y = rand.nextInt(HEIGHT_OF_FIELD);
			if (mineField[x][y].isMined()) {
				n--;
				continue;
			} else {
				mineField[x][y].setMined();
				for (i = x - 1; i < x + 2; i++)
					for (j = y - 1; j < y + 2; j++)
						if ((i >= 0) && (i <  WIDTH_OF_FIELD) && (j >= 0)
								&& (j <HEIGHT_OF_FIELD)) {
							mineField[i][j].incrementEnv();
						}
			}
		}
	}
	
	/**
	 * (x,y) - coords of cell
	 * @param x 
	 * @param y 
	 */	
	public boolean isCellMined(int x,int y) {
		return mineField[x][y].isMined();
	}
	
	/**
	 * (x,y) - coords of cell
	 * @param x 
	 * @param y
	 * @return number of mines around the cell if cell isn't mined, -1 else 
	 */	
	public int getEnv(int x,int y) {
		return mineField[x][y].getEnv();
	}

	/**
	 * (x,y) - coords of cell
	 * @param x 
	 * @param y 
	 */	
	public boolean isCellMarked(int x, int y) {
		// TODO Auto-generated method stub
		return mineField[x][y].isMarked();
	}

	/**
	 * (x,y) - coords of cell
	 * @param x 
	 * @param y 
	 */	
	public void unmarkCell(int x, int y) {
		// TODO Auto-generated method stub
		mineField[x][y].unmark();
	}
}
