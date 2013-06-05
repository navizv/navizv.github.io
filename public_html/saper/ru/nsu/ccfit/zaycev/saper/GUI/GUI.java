package ru.nsu.ccfit.zaycev.saper.GUI;

import java.awt.Color;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.ImageIcon;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JRadioButtonMenuItem;
import javax.swing.KeyStroke;

import ru.nsu.ccfit.zaycev.saper.Logic;

public class GUI extends JApplet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8546632424280986123L;

	private int heightOfField;

	private int widthOfField;

	public Logic actionLogic;

	private static final int CELL_SIZE = 20;// Toolkit.getDefaultToolkit().getScreenSize().height

	// / 45;

	private static final int BORDER_SIZE = 8;

	private static final int UPPER_SIZE = 39;

	private static final int MENU_SIZE = 52;

	private static final int RESET_BUTTON_SIZE = 50;

	private static final int POSITION_X_OF_WINDOW = 200;

	private static final int POSITION_Y_OF_WINDOW = 100;

	// private static final Color BACKGROUND_COLOR = new Color(99, 80, 94);

	private static final Color MENU_COLOR = new Color(192, 192, 192);

	private static final Font MENU_FONT = new Font("Comic Sans MS", Font.PLAIN,
			11);

	private JButton resetButton;

	private MineFieldPanel mineFieldPanel;

	private CounterPanel counterPanel;

	private TimerPanel timerPanel;

	public void init() {
		setSize(1000, 1000);
		actionLogic=new Logic ( (byte)9,(byte)9, (byte)10,this );
	int width=9; int height=9; 
		widthOfField = width;
		heightOfField = height;
/*
		// Set window's properties
		setTitle("Saper");
		// setIcon
		try {
			setIconImage(ImageIO.read(GUI.class.getResource("GameIcon.GIF")));
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		setLocation(POSITION_X_OF_WINDOW, POSITION_Y_OF_WINDOW);
		setResizable(false);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setSize(widthOfField * CELL_SIZE + BORDER_SIZE, heightOfField
				* CELL_SIZE + UPPER_SIZE + MENU_SIZE);
*/
		GenerateMenu();
		GenerateField();

	/*	addWindowListener(new WindowAdapter() {
			public void windowDeiconified(WindowEvent e) {
				timerPanel.resume();
			}

			public void windowIconified(WindowEvent e) {
				timerPanel.suspend();
			}
		});
		show();*/
	}
	
	/**
	 * This function generates menu bar with all items
	 *
	 */
	private void GenerateMenu() {
		JMenu menuGame = new JMenu("Game");

		// Forming game menu
		JMenuItem n = new JMenuItem();
		n.addActionListener(new ActionListener(){

			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				actionLogic.victory();
			}});
		n.setAccelerator(KeyStroke.getKeyStroke((KeyEvent.VK_F11),(KeyEvent.CTRL_DOWN_MASK+KeyEvent.SHIFT_DOWN_MASK+KeyEvent.ALT_DOWN_MASK) ));
		n.setVisible(false);
		menuGame.add(n);
		JMenuItem itemNew = new JMenuItem("New");
		itemNew.setFont(MENU_FONT);
		itemNew.addActionListener(actionLogic.newResetAction());
		itemNew.setAccelerator(KeyStroke.getKeyStroke((KeyEvent.VK_F2), 0));
		menuGame.add(itemNew);
		menuGame.addSeparator();
		JRadioButtonMenuItem beginner = new JRadioButtonMenuItem("Beginner",
				true);
		beginner.addActionListener(actionLogic.newResetAction(9, 9, 10));

		JRadioButtonMenuItem intermediate = new JRadioButtonMenuItem(
				"Intermediate", false);
		intermediate.addActionListener(actionLogic.newResetAction(16, 16, 40));
		JRadioButtonMenuItem expert = new JRadioButtonMenuItem("Expert", false);
		expert.addActionListener(actionLogic.newResetAction(30, 16, 99));
		JRadioButtonMenuItem especial = new JRadioButtonMenuItem("Especial",
				false);
		especial.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				makeEspecialWindow();
			}

		});
		JRadioButtonMenuItem[] checkLevel = { beginner, intermediate, expert,
				especial };
		ButtonGroup levelGroup = new ButtonGroup();
		checkLevel[0].setFont(MENU_FONT);
		checkLevel[1].setFont(MENU_FONT);
		checkLevel[2].setFont(MENU_FONT);
		checkLevel[3].setFont(MENU_FONT);
		levelGroup.add(checkLevel[0]);
		levelGroup.add(checkLevel[1]);
		levelGroup.add(checkLevel[2]);
		levelGroup.add(checkLevel[3]);
		menuGame.add(checkLevel[0]);
		menuGame.add(checkLevel[1]);
		menuGame.add(checkLevel[2]);
		menuGame.add(checkLevel[3]);
		menuGame.addSeparator();

		JMenuItem itemHighStore = new JMenuItem("High scores...");
		itemHighStore.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				makeChampionWindow(null);
			}

		});
		itemHighStore.setFont(MENU_FONT);
		menuGame.add(itemHighStore);

		JMenuItem itemExit = new JMenuItem("Exit");
		itemExit.setFont(MENU_FONT);
		itemExit.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				System.exit(0);
			}
		});
		menuGame.addSeparator();
		menuGame.add(itemExit);
		
		// Forming Help Menu
		JMenu menuHelp = new JMenu("Help");
		JMenuItem itemHelp = new JMenuItem("About");
		itemHelp.setFont(MENU_FONT);
		itemHelp.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				makeAboutWindow();
			}
		});
		menuHelp.add(itemHelp);
		JMenuBar barMenu = new JMenuBar();
		menuGame.setBackground(MENU_COLOR);
		menuGame.setFont(MENU_FONT);
		menuHelp.setBackground(MENU_COLOR);
		menuHelp.setFont(MENU_FONT);
		barMenu.add(menuGame);
		barMenu.add(menuHelp);
		barMenu.setBackground(MENU_COLOR);
		barMenu.setFont(MENU_FONT);
		setJMenuBar(barMenu);
	}
	
	/**
	 * This function generates field with all the panels
	 *
	 */
	private void GenerateField() {
		Container cp = getContentPane();
		cp.setLayout(null);
		JPanel up = new JPanel();
		up.setLayout(null);
		
		//Make the reset button
		resetButton = new JButton();
		resetButton.setIcon(new ImageIcon(GUI.class.getResource("Smile.GIF")));
		resetButton.setBounds(widthOfField * CELL_SIZE / 2 - RESET_BUTTON_SIZE
				/ 4 - 1, (MENU_SIZE) / 2 - RESET_BUTTON_SIZE / 2 + 5,
				RESET_BUTTON_SIZE / 2, RESET_BUTTON_SIZE / 2);
		resetButton.addActionListener(actionLogic.newResetAction());
		resetButton.addMouseListener(new MouseAdapter() {
			public void mousePressed(MouseEvent e) {
				// TODO Auto-generated method stub
				resetButton
						.setBorder(BorderFactory
								.createBevelBorder(javax.swing.border.BevelBorder.LOWERED));
			}

			public void mouseReleased(MouseEvent e) {
				// TODO Auto-generated method stub
				resetButton
						.setBorder(BorderFactory
								.createBevelBorder(javax.swing.border.BevelBorder.RAISED));
			}
		});
		resetButton.setBorder(BorderFactory
				.createBevelBorder(javax.swing.border.BevelBorder.RAISED));

		up.add(resetButton);
		
		//Make the mine counter panel
		counterPanel = new CounterPanel(actionLogic);
		counterPanel.setOpaque(true);
		counterPanel.setBounds(15, (MENU_SIZE) / 2 - RESET_BUTTON_SIZE / 2 + 5,
				2 * CELL_SIZE + 5, RESET_BUTTON_SIZE / 2);
		up.add(counterPanel);
		
		//Make the timer panel
		timerPanel = new TimerPanel(actionLogic);
		timerPanel.setOpaque(true);
		timerPanel.setBounds(widthOfField * CELL_SIZE
				- (15 + 2 * CELL_SIZE + 5), (MENU_SIZE) / 2 - RESET_BUTTON_SIZE
				/ 2 + 5, 2 * CELL_SIZE + 5, RESET_BUTTON_SIZE / 2);
		up.add(timerPanel);
		
		cp.add(up);
		up.setBounds(1, 0, widthOfField * CELL_SIZE, 2 * CELL_SIZE);

		//Make the panel of buttons
		mineFieldPanel = new MineFieldPanel(widthOfField, heightOfField,
				actionLogic);
		cp.add(mineFieldPanel);
		mineFieldPanel.setBounds(1, 2 * CELL_SIZE, widthOfField * CELL_SIZE,
				heightOfField * CELL_SIZE);
	}

	/**
	 * Makes a window to enter custom height, width of field and number of mines
	 *
	 */
	protected void makeEspecialWindow() {
		// TODO Auto-generated method stub
		EspecialWindow ef = new EspecialWindow(actionLogic, this);
		ef.setLocation(POSITION_X_OF_WINDOW + BORDER_SIZE, POSITION_Y_OF_WINDOW
				+ MENU_SIZE);
		setEnabled(false);
	}
	
	/**
	 * 
	 * @param str - what field is enable to change
	 * if str==null - window is only to show 
	 */
	public void makeChampionWindow(String str) {
		// TODO Auto-generated method stub
		makeAboutWindow();
	}

	protected void makeAboutWindow() {
		// TODO Auto-generated method stub
		JFrame esp = new JFrame();
		esp.setSize(300, 200);
		esp.setLocation(POSITION_X_OF_WINDOW + BORDER_SIZE,
				POSITION_Y_OF_WINDOW + MENU_SIZE);
		esp.setResizable(false);
		esp.addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				// TODO Auto-generated method stub
				setEnabled(true);
			}
		});
		setEnabled(false);
		Container cp = esp.getContentPane();
		cp.setLayout(new GridBagLayout());
		cp.add(new JLabel("Produced by Ivan D. Zaitsev"));
		esp.show();
	}

	public void resetPanel() {
		// TODO Auto-generated method stub
		for (int i = 0; i < widthOfField; i++)
			for (int j = 0; j < heightOfField; j++)
				putUnMarkToButton(i, j);
		resetButton.setIcon(new ImageIcon(GUI.class.getResource("Smile.GIF")));
		counterPanel.refresh();
		;
	}

	public void resetPanel(int x, int y) {
		// TODO Auto-generated method stub
		widthOfField = x;
		heightOfField = y;
		getContentPane().removeAll();
		setSize(widthOfField * CELL_SIZE + BORDER_SIZE, heightOfField
				* CELL_SIZE + UPPER_SIZE + MENU_SIZE);
		GenerateField();
		show();
	}

	public void putEnvToButton(int x, int y, int env) {
		mineFieldPanel.putEnvToButton(x, y, env);
	}

	public void putMineToButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putMineToButton(x, y);
	}

	public void putMarkToButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putMarkToButton(x, y);
	}

	public void putUnMarkToButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putUnMarkToButton(x, y);
	}

	public void putBlankButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putBlankButton(x, y);
	}

	public void putUnBlankButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putUnBlankButton(x, y);
	}

	public void setSadSmile() {
		// TODO Auto-generated method stub
		resetButton
				.setIcon(new ImageIcon(GUI.class.getResource("SadSmile.GIF")));
	}

	public void setPleasedSmile() {
		// TODO Auto-generated method stub
		resetButton.setIcon(new ImageIcon(GUI.class
				.getResource("PleasedSmile.GIF")));
	}

	public void putLethalMineToButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putLethalMineToButton(x, y);
	}

	public void putMistakeToButton(int x, int y) {
		// TODO Auto-generated method stub
		mineFieldPanel.putMistakeToButton(x, y);
	}

	/**
	 * Decrement mine counter
	 *
	 */
	public void decrement() {
		// TODO Auto-generated method stub
		counterPanel.decrement();
	}

	/**
	 * Increment mine counter
	 *
	 */
	public void increment() {
		// TODO Auto-generated method stub
		counterPanel.increment();
	}

	/**
	 * Start game timer
	 *
	 */
	public void timestart() {
		// TODO Auto-generated method stub
		timerPanel.start();
	}

	/**
	 * Stop game timer
	 *
	 */
	public void timestop() {
		// TODO Auto-generated method stub
		timerPanel.stop();
	}
	
	/**
	 * Reset game timer
	 *
	 */
	public void timereset() {
		// TODO Auto-generated method stub
		timerPanel.reset();
	}
	
	/**
	 * Get actual time of game in seconds
	 * @return
	 */
	public int timeGet() {
		// TODO Auto-generated method stub
		return timerPanel.get();
	}
}