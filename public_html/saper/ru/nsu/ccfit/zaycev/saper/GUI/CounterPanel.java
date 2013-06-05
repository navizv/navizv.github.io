package ru.nsu.ccfit.zaycev.saper.GUI;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontFormatException;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.swing.BorderFactory;
import javax.swing.JLabel;

import ru.nsu.ccfit.zaycev.saper.Logic;

public class CounterPanel extends JLabel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6496690843812033194L;

	private Logic actionLogic;

	private int value;

	public CounterPanel(Logic logic) {
		actionLogic = logic;
		value = actionLogic.getNumbOfMine();
		setBackground(Color.BLACK);
		setBorder(BorderFactory.createEtchedBorder());
		//set font
		Font c = new Font(null,1,1);
		try {
			 c = Font.createFont(Font.TRUETYPE_FONT, CounterPanel.class.getResourceAsStream("a_LCDNovaOtl Regular.Ttf"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FontFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		setBackground(Color.BLACK);
		setForeground(Color.RED);
		repaint();
		setHorizontalAlignment(JLabel.RIGHT);
		setFont(c.deriveFont((float)20));
		setText("" + value);
		
	}

	public void increment() {
		value++;
		setText("" + value);
	}

	public void decrement() {
		value--;
		setText("" + value);
	}

	public void refresh() {
		// TODO Auto-generated method stub
		value = actionLogic.getNumbOfMine();
		setText("" + value);
	}
}
