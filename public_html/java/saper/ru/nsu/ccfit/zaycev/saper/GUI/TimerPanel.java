package ru.nsu.ccfit.zaycev.saper.GUI;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.swing.BorderFactory;
import javax.swing.JLabel;
import javax.swing.Timer;

import ru.nsu.ccfit.zaycev.saper.Logic;

public class TimerPanel extends JLabel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2142261653176111549L;

	private int time = 0;

	private boolean run = false;

	private Timer timer = new Timer(1000, new ActionListener() {

		public void actionPerformed(ActionEvent e) {
			// TODO Auto-generated method stub
			increment();
		}

	});

	public TimerPanel(Logic logic) {
		setBackground(Color.BLACK);
		setBorder(BorderFactory.createEtchedBorder());
		Font c = new Font(null, 1, 1);
		try {
			c = Font.createFont(Font.TRUETYPE_FONT, TimerPanel.class
					.getResourceAsStream("a_LCDNovaOtl Regular.Ttf"));
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
		setHorizontalAlignment(JLabel.RIGHT);
		setFont(c.deriveFont((float) 20));
		setText("0");
		repaint();
		setHorizontalAlignment(JLabel.RIGHT);
	}

	public void start() {
		time = 0;
		setText("" + time);
		timer.start();
		run = true;
	}

	private void increment() {
		// TODO Auto-generated method stub
		time++;
		setText("" + time);
		repaint();
	}

	public void stop() {
		timer.stop();
		run = false;
	}

	public void reset() {
		// TODO Auto-generated method stub
		timer.stop();
		time = 0;
		setText("" + time);
		run = false;
		repaint();
	}

	public void resume() {
		// TODO Auto-generated method stub
		if (run)
			timer.restart();
	}

	public void suspend() {
		// TODO Auto-generated method stub
		if (run)
			timer.stop();
	}

	public int get() {
		// TODO Auto-generated method stub
		return time;
	}
}
