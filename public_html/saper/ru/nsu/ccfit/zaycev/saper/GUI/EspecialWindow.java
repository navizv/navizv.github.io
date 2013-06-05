package ru.nsu.ccfit.zaycev.saper.GUI;

import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JTextField;

import ru.nsu.ccfit.zaycev.saper.Logic;

public class EspecialWindow extends JFrame {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7925717433966372067L;

	public static final int width = 230;

	public static final int height = 150;

	public static final int labelWidth = 60;

	public static final int labelHeight = 20;

	public static final int buttonWidth = 60;

	public static final int buttonHeight = 25;

	public static final int labelX = 20;

	private JTextField tfW;

	private JTextField tfH;

	private JTextField tfM;

	private Logic actionLogic;

	private GUI mineField;

	public EspecialWindow(Logic logic, GUI field) {
		mineField = field;
		actionLogic = logic;
		// TODO Auto-generated method stub
		setSize(width, height);
		setResizable(false);
		setTitle("Especial field");
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				// TODO Auto-generated method stub
				mineField.setEnabled(true);
			}
		});

		try {
			setIconImage(ImageIO.read(EspecialWindow.class.getResource("GameIcon.GIF")));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Container cp = getContentPane();
		cp.setLayout(null);
		JLabel jl = new JLabel("width:");
		cp.add(jl);
		jl.setBounds(labelX, 20, labelWidth, labelHeight);
		jl = new JLabel("height:");
		cp.add(jl);
		jl.setBounds(labelX, 50, labelWidth, labelHeight);
		jl = new JLabel("mines:");
		cp.add(jl);
		jl.setBounds(labelX, 80, labelWidth, labelHeight);

		tfW = new JTextField("" + actionLogic.getWidthOfField());
		cp.add(tfW);
		tfW.setBounds(labelX + labelWidth, 20, labelWidth, labelHeight);

		tfH = new JTextField("" + actionLogic.getHeightOfField());
		cp.add(tfH);
		tfH.setBounds(labelX + labelWidth, 50, labelWidth, labelHeight);

		tfM = new JTextField("" + actionLogic.getNumbOfMine());
		cp.add(tfM);
		tfM.setBounds(labelX + labelWidth, 80, labelWidth, labelHeight);

		JButton ok = new JButton("Ok");

		ok.setBorder(BorderFactory
				.createBevelBorder(javax.swing.border.BevelBorder.RAISED));
		cp.add(ok);
		ok.setBounds(150, 25, buttonWidth, buttonHeight);
		ok.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent ev) {
				// TODO Auto-generated method stub
				try {
					actionLogic.reset(Integer.parseInt(tfW.getText()), Integer
							.parseInt(tfH.getText()), Integer.parseInt(tfM
							.getText()));
				} catch (NumberFormatException e) {
				}
				mineField.setEnabled(true);
				hide();
			}

		});

		JButton cansel = new JButton("Cancel");
		cansel.setBorder(BorderFactory
				.createBevelBorder(javax.swing.border.BevelBorder.RAISED));
		cp.add(cansel);
		cansel.setBounds(150, 70, buttonWidth, buttonHeight);
		cansel.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				mineField.setEnabled(true);
				hide();
			}

		});
		show();
	}

}
