package ru.nsu.ccfit.zaycev.runstr;

import java.applet.Applet;

import java.awt.Button;
import java.awt.Color;
import java.awt.Label;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class RunApp extends Applet {

    /**
     *  
     */
    private static final long serialVersionUID = 6252739042971912735L;

    private class RunningString extends Thread {
        private String str;
        private int delay;
        private boolean isRunning;
        private int fieldLength;
        
        public RunningString(String string) {
            isRunning = true;
            str = string;
            fieldLength=labelWidth/2;
            if (str.length() < fieldLength) {
                System.out.println("end");
                String end = new String();
                int endlen = fieldLength - str.length();
                for (int i = 0; i < endlen; i++)
                    end += "  ";
                System.out.println("n" + end + "n");
                str = end.concat(str);
            }
            try {
                delay = Integer.parseInt(getParameter("delay"));
            } catch (NullPointerException e) {
                delay = 300;
            }
            catch (NumberFormatException e) {
                delay = 300;
            }
            
            start();
        }

        public void invert() {
            isRunning = !isRunning;
            if(isRunning)
                button.setLabel("Stop");
            else
                button.setLabel("Run");
        }

        public void run() {
            while (true) {
                if (isRunning) {
                    label.setText(str);
                    str = str.substring(1) + str.charAt(0);
                }
                try {
                    sleep(delay);
                } catch (InterruptedException e) {
                    System.err.println(e.toString());
                }
            }
        }
    }

    private Button button;

    private Label label;
    private static final int labelWidth=50;
    private RunningString runningString;

    public void init() {
        setLayout(null);
        setBackground(Color.GREEN.darker().darker());
        repaint();
        button = new Button("Stop");
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                runningString.invert();
            }
        });
        add(button);
        button.setBounds(80, 120, labelWidth, 30);
        label = new Label();
        label.setBackground(Color.WHITE);
        label.setForeground(Color.RED);
        label.setBounds(30, 60, 150, 25);
        //label.setFont(new Font("Comic Sans MS", Font.PLAIN,12));
        add(label);
        try {
            runningString = new RunningString(getParameter("string"));
        } catch (NullPointerException e) {
            runningString = new RunningString(
                    "Congratulations from default set running string!!      ");
        }
    }

    public void start() {
    }

    public void stop() {
    }

    public void destroy() {
    }
}