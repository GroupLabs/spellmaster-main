"use client";

import {
  color_border,
  color_container_primary,
  color_header_and_footer,
  color_on_surface,
  color_surface,
  color_surface_variant,
  font_cabin_sketch_str,
} from "@/theme";
import {
  Button,
  Stack,
  Typography,
  Box,
  FormControl,
  Input,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import background1 from "../../public/background1.jpg";
import Image from "next/image";
import { BorderAll, CheckCircle } from "@mui/icons-material";
import FeatureCard from "./feature-card";
import ReviewCard from "./review-card";
import BrandBlock from "../brand-block";
import Link from "next/link";

const StartGame = () => {
  const router = useRouter();
  return (
    <Stack
      minHeight={"calc(100vh - 64px)"}
      style={{
        background: color_surface,
        backgroundImage: `url(${background1.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "center",
      }}
      paddingTop={"96px"}
    >
      <Typography fontSize={100} fontFamily={font_cabin_sketch_str}>
        Spokabulary
      </Typography>
      <Typography
        fontSize={28}
        textAlign={"center"}
        marginBottom={"72px"}
        marginTop={"-8px"}
      >
        Create custom spelling and vocabulary games
        <br />
        in just 3 easy steps!
      </Typography>

      <Typography fontSize={24} textAlign={"center"} marginBottom={"8px"}>
        Turn your word lists into individual practice activities
      </Typography>
      <Typography fontSize={18} textAlign={"center"} marginBottom={"8px"}>
        Powered by AI 
      </Typography>

      <Box width={"180px"} alignItems={"center"} marginX={"auto"}>
        <Button
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            fontSize: "18px",
          }}
          fullWidth
          onClick={() => {
            router.push("/word-list-settings");
          }}
        >
          Get Started
        </Button>
      </Box>
    </Stack>
  );
};

const Intro1 = () => {
  const router = useRouter();
  return (
    <Stack
    minHeight={"110vh"}
      style={{
        background: color_surface,
        alignItems: "center",
        paddingTop: "80px",
      }}
    >
      <Stack
        direction="row"
        width={"100%"}
        paddingX={"64px"}
        spacing={"64px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack maxWidth={"640px"}>
          <Image
            src={"/lightbulb.png"}
            alt="lightbulb"
            width={48}
            height={48}
          />

          <Stack spacing={"16px"}>
            <Typography fontWeight={"bold"} fontSize={"24px"}>
              Discover the Fun Side of Learning with Spokabulary
            </Typography>
            <Typography fontSize={"16px"}>
              Our exciting games turn learning into a fun adventure! With AI
              tools, teachers easily create custom word lists, and you get
              personalized challenges to make mastering vocabulary efficient and
              enjoyable. Dive in, improve your spelling, and explore a world
              where learning is fun. Ready to make spelling a blast? Join
              Spokabulary today!
            </Typography>
            <Box>
              <Button
                style={{
                  background: color_container_primary,
                  color: color_on_surface,
                  textTransform: "none",
                  fontSize: "18px",
                  padding: "4px 24px",
                }}
                onClick={() => {
                  router.push("/word-list-settings");
                }}
              >
                Get started!
              </Button>
            </Box>
          </Stack>
        </Stack>

        <Image
          src={"/landing_page_girl.png"}
          alt="landing_page_girl"
          width={422}
          height={370}
        />
      </Stack>

      <Stack alignItems={"center"} paddingTop={"36px"}>
        <Stack maxWidth={"640px"} alignItems={"center"}>
          <Typography fontWeight={"bold"} fontSize={"24px"}>
            Games Focus on Exciting Challenges
          </Typography>
          <Typography fontSize={"16px"}>
            Explore a variety of games designed to boost your spelling skills.
            Each game is designed to make learning new words enjoyable and
            interactive.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={"16px"} marginTop={"16px"}>
          <Button
            style={{
              background: "#ffffff",
              color: color_on_surface,
              textTransform: "none",
              fontSize: "18px",
              padding: "4px 16px",
              borderRadius: "16px",
            }}
          >
            <Stack direction="row" spacing={"4px"} alignItems="center">
              <Image
                src={"/game_icon1.png"}
                alt="game_icon1"
                width={48}
                height={48}
              />
              <Typography>Word Unscramble</Typography>
            </Stack>
          </Button>
          <Button
            style={{
              background: "#ffffff",
              color: color_on_surface,
              textTransform: "none",
              fontSize: "18px",
              padding: "4px 16px",
              borderRadius: "16px",
            }}
          >
            <Stack direction="row" spacing={"4px"} alignItems="center">
              <Image
                src={"/game_icon2.png"}
                alt="game_icon1"
                width={48}
                height={48}
              />
              <Typography>Word Unscramble</Typography>
            </Stack>
          </Button>
          <Button
            style={{
              background: "#ffffff",
              color: color_on_surface,
              textTransform: "none",
              fontSize: "18px",
              padding: "4px 16px",
              borderRadius: "16px",
            }}
          >
            <Stack direction="row" spacing={"4px"} alignItems="center">
              <Image
                src={"/game_icon3.png"}
                alt="game_icon1"
                width={48}
                height={48}
              />
              <Typography>Word Unscramble</Typography>
            </Stack>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Intro2 = () => {
  return (
    <Stack
    minHeight={"70vh"}
      style={{
        background: color_surface_variant,
        alignItems: "center",
        paddingTop: "96px",
      }}
      paddingX={"16px"}
    >
      <Stack
        width={"100%"}
        direction="row"
        alignItems="center"
        justifyContent={"center"}
        spacing={"48px"}
      >
        <Image
          src={"/landing_page_boy.png"}
          alt="landing_page_boy"
          width={422}
          height={370}
        />
        <Stack paddingRight={"48px"} spacing={"16px"}>
          <Typography fontWeight={"bold"} fontSize={"24px"}>
            What Will You Gain with Spokabulary?
          </Typography>
          <Stack>
            <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
              <CheckCircle />
              <Typography fontSize={"16px"}>
                Master spelling with AI-powered word lists tailored to your
                learning needs
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
              <CheckCircle />
              <Typography fontSize={"16px"}>
                Boost your confidence in using new words correctly
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
              <CheckCircle />
              <Typography fontSize={"16px"}>
                Enjoy learning and make progress while having fun
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Intro3 = () => {
  return (
    <Stack
    minHeight={"80vh"}
      style={{
        background: color_surface,
        alignItems: "center",
        paddingTop: "96px",
      }}
      paddingX={"16px"}
    >
      <Typography fontWeight={"bold"} fontSize={"36px"}>
        Why should you choose Spokabulary?
      </Typography>
      <Stack width={"100%"} marginTop={"32px"}>
        <Stack
          style={{
            position: "relative",
          }}
        >
          <Stack
            direction={"row"}
            zIndex={10}
            justifyContent={"center"}
            spacing={"32px"}
          >
            <FeatureCard
              title={`Empower Your\nClassroom with AI`}
              description="Enhance your teaching with our AI powered tools. Effortlessly create custom spelling lists and engage students with interactive games that make learning fun."
              role="As Teacher"
              imageSrc="/landing_page_feature_teacher.png"
            />
            <FeatureCard
              title="Learn While You Play"
              description="Dive into a world of interactive games. Master new words and boost your spelling skills through play, making learning both enjoyable and impactful."
              role="As Student"
              imageSrc="/landing_page_feature_book.png"
            />
            <FeatureCard
              title="Effective and Rewarding"
              description="Save time with ready-to-use educational games. Spokabulary’s engaging format maximizes learning efficiency and ensures that every minute spent is rewarding."
              role="As Institute"
              imageSrc="/landing_page_feature_save_money.png"
            />
          </Stack>
          <Box
            width={"1100px"}
            height={"220px"}
            style={{
              position: "absolute",
              bottom: "-70px",
              // center the box
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Box
              style={{ background: "#FAB900" }}
              width={"100%"}
              height={"100%"}
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Review = () => {
  return (
    <Stack
      minHeight={"75%"}
      style={{
        background: color_surface_variant,
        alignItems: "center",
        paddingTop: "96px",
      }}
      paddingX={"16px"}
      spacing={"32px"}
    >
      <Typography fontSize={"36px"} fontWeight={"bold"}>
        What do users say about Spokabulary?
      </Typography>
      <Stack direction="row" justifyContent={"center"} spacing={"24px"}>
        <ReviewCard
          avatarSrc="/review_avatar1.png"
          name="Jessica Andrew"
          stars={5}
          description="Spokabulary has been a fantastic tool in my classroom. The games keep my students engaged and make spelling practice enjoyable. They’re learning new words faster and with more enthusiasm."
        />
        <ReviewCard
          avatarSrc="/review_avatar2.png"
          name="Darlene Robertson"
          stars={5}
          description="Spokabulary makes spelling so much fun! I love playing Word Bubbles and seeing how many words I can pop. It helps me remember the spellings better and I actually look forward to practicing!"
        />
        <ReviewCard
          avatarSrc="/review_avatar3.png"
          name="Dianne Russell"
          stars={5}
          description="I used to find spelling boring, but with Spokabulary, I feel like I’m on a game show! SpellingChallenge is my favorite because it’s exciting to test myself and see how much I’ve improved."
        />
      </Stack>
    </Stack>
  );
};

const Subscribe = () => {
  return (
    <Stack
      minHeight={"60%"}
      style={{
        background: color_surface,
        alignItems: "center",
        paddingTop: "96px",
      }}
      paddingX={"16px"}
      spacing={"32px"}
    >
      <Stack
        position="relative"
        width={"960px"}
        height={"248px"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box position={"absolute"} height={"100%"} width={"100%"} zIndex={1}>
          <Image
            src={"/landing_page_subscribe.png"}
            alt="landing_page_subscribe"
            fill
          />
        </Box>
        <Stack zIndex={2} alignItems={"center"} width={"360px"} spacing={"8px"}>
          <Typography fontSize={"24px"} fontWeight={"bold"} color={"white"}>
            Do you still have any questions?
          </Typography>
          <Typography fontSize={"12px"} color={"white"} textAlign={"center"}>
            Don&lsquo;t hesitate to leave us your email. We will contact you to
            discuss any questions you may have
          </Typography>
          <FormControl
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "32px",
              width: "360px",
              marginTop: "16px",
            }}
          >
            <Input
              style={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "0px 16px",
                margin: "0px",
                height: "100%",
                width: "280px",
                borderRadius: "8px 0px 0px 8px",
              }}
              placeholder="Enter your email"
              disableUnderline
            />
            <Button
              style={{
                background: color_container_primary,
                color: "white",
                textTransform: "none",
                borderRadius: "0px 8px 8px 0px",
                padding: "0px",
                margin: "0px",
                height: "100%",
                width: "80px",
              }}
            >
              Send
            </Button>
          </FormControl>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Footer = () => {
  return (
    <Grid
      container
      columns={10}
      style={{
        background: color_header_and_footer,
        padding: "24px 128px",
      }}
    >
      <Grid item xs={3}>
        <Stack spacing={"4px"}>
          <BrandBlock />
          <Stack
            direction={"row"}
            paddingBottom={"24px"}
            paddingTop={"8px"}
            spacing={"12px"}
          >
            <Link href="/">
              <Image
                src={"/logo_facebook.png"}
                alt="facebook"
                width={24}
                height={24}
              />
            </Link>
            <Link href="/">
              <Image src={"/logo_x.png"} alt="x" width={24} height={24} />
            </Link>
            <Link href="/">
              <Image
                src={"/logo_linkedin.png"}
                alt="linkedin"
                width={24}
                height={24}
              />
            </Link>
          </Stack>
          <Typography>©2024 Spokabulary.com</Typography>
          <Typography>
            Spokabulary is a registered
            <br /> trademark of Spokabulary.com
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={"8px"}>
          <Typography fontWeight={"bold"} fontSize={"20px"} paddingTop={"12px"}>
            Games
          </Typography>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Word Unscramble</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Word Bubbles</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Spelling Challenge</Typography>
          </Link>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={"8px"}>
          <Typography fontWeight={"bold"} fontSize={"20px"} paddingTop={"12px"}>
            Community
          </Typography>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Learners</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Partners</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Developers</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Teaching Center</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Blog</Typography>
          </Link>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={"8px"}>
          <Typography fontWeight={"bold"} fontSize={"20px"} paddingTop={"12px"}>
            Quick links
          </Typography>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Home</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Professional Education</Typography>
          </Link>
        </Stack>
      </Grid>
      <Grid item xs={1}>
        <Stack spacing={"8px"}>
          <Typography fontWeight={"bold"} fontSize={"20px"} paddingTop={"12px"}>
            More
          </Typography>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Press</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Terms</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Privacy</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Help</Typography>
          </Link>
          <Link href="/" style={{ width: "fit-content" }}>
            <Typography fontSize={"16px"}>Contact</Typography>
          </Link>
        </Stack>
      </Grid>
    </Grid>
  );
};

export const Welcome = () => {
  return (
    <Stack
      height={"100%"}
      width={"100%"}
      style={{
        background: color_surface,
      }}
    >
      <StartGame />
      <Intro1 />
      <Intro2 />
      <Intro3 />
      {/* <Review />
      <Subscribe /> */}
      <Footer />
    </Stack>
  );
};
