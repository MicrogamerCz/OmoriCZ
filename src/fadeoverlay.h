#pragma once

#include <QGraphicsOpacityEffect>
#include <QPropertyAnimation>
#include <QWidget>

class FadeOverlay : public QWidget {
    Q_OBJECT

  public:
    explicit FadeOverlay(QWidget *parent = nullptr);

    void setVisible(bool visible) override;

    Q_SIGNAL void fadeFinished();

  protected:
    void paintEvent(QPaintEvent *event) override;

  private:
    QGraphicsOpacityEffect *m_opacityEffect;
    QPropertyAnimation *m_fadeAnimation;
};
