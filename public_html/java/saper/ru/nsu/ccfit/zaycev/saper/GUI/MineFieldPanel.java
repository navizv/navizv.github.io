package ru.nsu.ccfit.zaycev.saper.GUI;

import java.awt.Color;
import java.awt.GridLayout;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.border.BevelBorder;

import ru.nsu.ccfit.zaycev.saper.Logic;

public class MineFieldPanel extends JPanel{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8810548797450844535L;

	private int heightOfField;

	private int widthOfField;

	public final Logic actionLogic;

	private static final int CELL_SIZE = 20;// Toolkit.getDefaultToolkit().getScreenSize().height

	// / 45;
	private static final Color BUTTON_COLOR = new Color(162, 162, 162);

	private JButton buttons[][];

	public MineFieldPanel(int width, int height, Logic logic) {
		widthOfField = width;
		heightOfField = height;
		actionLogic = logic;
		buttons = new JButton[widthOfField][heightOfField];
		setLayout(new GridLayout(heightOfField, widthOfField));
		for (int j = 0; j < heightOfField; j++)
			for (int i = 0; i < widthOfField; i++) {
				buttons[i][j] = new JButton("");
				buttons[i][j].setVisible(true);
				buttons[i][j].setBackground(BUTTON_COLOR);
				buttons[i][j].setSize(CELL_SIZE, CELL_SIZE);
				buttons[i][j].addMouseListener(actionLogic.newMyMouseAction(i,
						j));
				buttons[i][j]
						.setBorder(BorderFactory
								.createBevelBorder(javax.swing.border.BevelBorder.RAISED));
				add(buttons[i][j]);
			}
	}

	/**
	 * 
	 * @param x
	 * @param y - coords of the button
	 * @param env - number to put on the button
	 */
	public void putEnvToButton(int x, int y, int env) {
	    buttons[x][y].setBorder(BorderFactory.createLineBorder(Color.GRAY));
		//buttons[x][y].setBorderPainted(false);
		buttons[x][y].setFocusable(false);
		buttons[x][y].setContentAreaFilled(false);
		buttons[x][y].setIcon(new ImageIcon(GUI.class.getResource(env + ".GIF")));
	}

	public void putMineToButton(int x, int y) {
		// TODO Auto-generated method stub
		buttons[x][y].setIcon(new ImageIcon(GUI.class.getResource("Mine.GIF")));
		buttons[x][y].setEnabled(true);
	}

	public void putMarkToButton(int x, int y) {
		// TODO Auto-generated method stub
		buttons[x][y].setFocusable(false);
		buttons[x][y].setFocusPainted(false);
		buttons[x][y].setContentAreaFilled(false);
		buttons[x][y].setIcon(new ImageIcon(GUI.class.getResource("9.GIF")));
	}

	public void putUnMarkToButton(int x, int y) {
		// TODO Auto-generated method stub
		buttons[x][y].setBorderPainted(true);
		buttons[x][y].setContentAreaFilled(true);
		buttons[x][y].setFocusable(true);
		buttons[x][y].setFocusPainted(true);
		buttons[x][y].setContentAreaFilled(true);
		buttons[x][y].setIcon(null);
		buttons[x][y].setBackground(BUTTON_COLOR);
		buttons[x][y].setBorder(BorderFactory.createBevelBorder(BevelBorder.RAISED));
	}

	public void putBlankButton(int x, int y) {
		// TODO Auto-generated method stub
	    buttons[x][y].setBorder(BorderFactory.createLineBorder(Color.GRAY));
		//buttons[x][y].setBorderPainted(false);
		buttons[x][y].setContentAreaFilled(false);
		buttons[x][y].setBackground(Color.GRAY.brighter());
	}

	public void putUnBlankButton(int x, int y) {
		// TODO Auto-generated method stub
	    buttons[x][y].setContentAreaFilled(true);
		//buttons[x][y].setBorderPainted(true);
		buttons[x][y].setBorder(BorderFactory.createBevelBorder(BevelBorder.RAISED));
		buttons[x][y].setBackground(BUTTON_COLOR);
	}

	public void putLethalMineToButton(int x, int y) {
		// TODO Auto-generated method stub
		buttons[x][y].setIcon(new ImageIcon(GUI.class.getResource("LethalMine.GIF")));
	}

	public void putMistakeToButton(int x, int y) {
		// TODO Auto-generated method stub
		putUnMarkToButton(x, y);
		buttons[x][y].setIcon(new ImageIcon(GUI.class.getResource("WrongMine.GIF")));
	}
}
