#pragma once

#include <QPropertyAnimation>
#include <QRadioButton>
#include <QSequentialAnimationGroup>

class OmoriRadio : public QRadioButton {
    Q_OBJECT
    Q_PROPERTY(int indicatorOffset READ indicatorOffset WRITE setIndicatorOffset)

  public:
    OmoriRadio(const QString &text, QWidget *parent = nullptr);

    QSize sizeHint() const override;

    int indicatorOffset() const;
    void setIndicatorOffset(int offset);

  protected:
    void paintEvent(QPaintEvent *event) override;

  private:
    int m_offset;
    QPixmap m_radio;
    QSequentialAnimationGroup m_animation;
};
