#include "omoriradio.h"

#include <QFontMetrics>
#include <QPainter>

using namespace Qt::Literals::StringLiterals;

OmoriRadio::OmoriRadio(const QString &text, QWidget *parent) : QRadioButton(text, parent), m_offset(0), m_radio(u":/contents/radio.png"_s) {
    setChecked(true);

    QFont radioFont = font();
    radioFont.setPixelSize(36);
    setFont(radioFont);

    QPropertyAnimation *anim1 = new QPropertyAnimation(this, "indicatorOffset");
    anim1->setStartValue(0);
    anim1->setEndValue(10);
    anim1->setDuration(225);

    QPropertyAnimation *pause1 = new QPropertyAnimation(this, "indicatorOffset");
    pause1->setStartValue(10);
    pause1->setEndValue(10);
    pause1->setDuration(150);

    QPropertyAnimation *anim2 = new QPropertyAnimation(this, "indicatorOffset");
    anim2->setStartValue(10);
    anim2->setEndValue(0);
    anim2->setDuration(225);

    QPropertyAnimation *pause2 = new QPropertyAnimation(this, "indicatorOffset");
    pause2->setStartValue(0);
    pause2->setEndValue(0);
    pause2->setDuration(150);

    m_animation.addAnimation(anim1);
    m_animation.addAnimation(pause1);
    m_animation.addAnimation(anim2);
    m_animation.addAnimation(pause2);
    m_animation.setLoopCount(-1);

    connect(this, &QRadioButton::toggled, this, [this](bool checked) {
        if (checked)
            m_animation.start();
        else {
            m_animation.stop();
            setIndicatorOffset(0);
        }
    });

    if (isChecked())
        m_animation.start();
}

QSize OmoriRadio::sizeHint() const {
    QFontMetrics fm(font());

    int textWidth = fm.horizontalAdvance(text());
    int textHeight = fm.height();

    return QSize(58 + 12 + textWidth, qMax(30, textHeight));
}

int OmoriRadio::indicatorOffset() const {
    return m_offset;
}

void OmoriRadio::setIndicatorOffset(int offset) {
    if (m_offset == offset)
        return;

    m_offset = offset;
    update();
}

void OmoriRadio::paintEvent(QPaintEvent *event) {
    Q_UNUSED(event)

    QPainter painter(this);

    const int indicatorWidth = 58;
    const int indicatorHeight = 30;
    const int spacing = 12;

    int y = (height() - indicatorHeight) / 2;

    if (isChecked())
        painter.drawPixmap(m_offset, y, indicatorWidth, indicatorHeight, m_radio);

    QRect textRect(indicatorWidth + spacing, 0, width() - indicatorWidth - spacing, height());

    painter.setPen(palette().windowText().color());
    painter.drawText(textRect, Qt::AlignLeft | Qt::AlignVCenter, text());
}
